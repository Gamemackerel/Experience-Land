import { TextProcessBase, TextProcessingResult } from './textProcessBase';
import { LocationGraph, LocationTracker } from '../locationTracker';
import Anthropic from '@anthropic-ai/sdk';
import { debug } from '@anthropic-ai/sdk/core';

export class Bork extends TextProcessBase {
  private client: Anthropic;
  private currentState: string;
  private narrative: string;
  private start: string;
  private rules: string;
  private gameMap: LocationGraph;
  private playerLocation: LocationTracker;


  constructor(apiKey: string) {
    super(apiKey);
    this.client = new Anthropic({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });

    // Initialize with default state
    this.currentState = `{
        "inventory": ["sword", "sheild", "health potion (1)"],
        "player_health": "3",
        "player_hints": ["You've heard there is treasure somewhere in the temple"],
        "player_key_knowledge": [],
        "game_state": "playing",
    }
    `;


    this.gameMap = new Map([
      ['ENTRANCE', {
        id: 'ENTRANCE',
        name: 'Temple Entrance',
        description: 'You are at the entrance of an ancient temple. The stone walls are covered in mysterious glyphs, and the air is thick with anticipation. Down the dark hall in front of you, you can see it opens into a large antechamber.',
        isVisited: false,
        navigable: [{
          option: 'dark hallway',
          destination: 'ANTECHAMBER'
        }],
        objects: [],
        npcs: []
      }],
      ['ANTECHAMBER', {
        id: 'ANTECHAMBER',
        name: 'Temple Antechamber',
        description: 'You are in a large room with pillar columns of stone engraved with runes. It is dark, cold, and silent aside from a dripping noise. The entrance archway is to the south, and then there are 3 doors.',
        isVisited: false,
        navigable: [
          {
            option: 'hallway to temple entrance',
            destination: 'ENTRANCE'
          },
          {
            option: 'wrought iron door to the east',
            destination: 'ROOM_1'
          },
          {
            option: 'dark wood door to the north',
            destination: 'ROOM_2'
          },
          {
            option: 'stone door inscribed with runes to the west',
            destination: 'ROOM_3'
          }
        ],
        objects: [],
        npcs: []
      }],
      ['ROOM_1', {
        id: 'ROOM_1',
        name: 'Temple Room 1',
        description: `a small room, with a painting on the wall. A painting of a goblin in a cave is here, with a sign that reads: "I am a goblin in a cave. Say these words and see the truth.". You take note of the words. If the player says the words in this room, nothing happens.
DO NOT HINT AT THIS, but If the player inspects the painting extremely closely, they can see that the eyes of the goblin is looking into a mirror.
`,
        isVisited: false,
        firstVisitEffect: `The phrase "I am a goblin in a cave. Say these words and see the truth." was inscribed next to a painting of a goblin in a cave. The phrase and where it was found are added to the player_key_knowledge.`,
        navigable: [
          {
            option: 'door to antechamber',
            destination: 'ANTECHAMBER'
          }
        ],
        objects: [],
        npcs: []
      }],
      ['ROOM_2', {
        id: 'ROOM_2',
        name: 'Temple Room 2',
        description: `a small room, with a mirror on the wall. If the player looks into the mirror and
        says the words "I am a goblin in a cave" which they learned in the other room, the mirror fragment into a million shards,
        and a hallway is left behind to the treasure room. THIS IS ONLY POSSIBLE IF THAT PHRASE IS IN THE PLAYER_KEY_KNOWLEDGE.
        DO NOT HINT AT THIS.
        If that happens, the player is congratulated for finding the treasure and the game is over, nothing more to do; set the game_state to "won".

        If the player specifically says that they look extremely hard at the mirror, they will notice that their face looks slightly different, contorted by the old glass.
        `,
        isVisited: false,
        navigable: [
          {
            option: 'door to antechamber',
            destination: 'ANTECHAMBER'
          }
        ],
        objects: [],
        npcs: []
      }],
      ['ROOM_3', {
        id: 'ROOM_3',
        name: 'Temple Room 3',
        description: `a small room with a goblin in the corner, who, IF STILL ALIVE, attacks when you enter.
        In order to fight the goblin, the player is allowed one action per turn.
        If the player hits the goblin 3 times, the goblin is killed, and the player can continue.
        Be sure to update the state of the goblin.
        If the player is hit 3 times, they are killed, the game is over and no more interaction is possible.
        The health potion can be used to restore 2 hp.`,
        isVisited: false,
        navigable: [
          {
            option: 'door to antechamber',
            destination: 'ANTECHAMBER'
          }
        ],
        objects: [],
        npcs: [{
          id: 'goblin',
          name: 'Goblin',
          description: 'holds a crude sword and attacks. Attacks 1-2 times per turn. Can be disarmed if parried with a sheild.',
          inventory: ['crude sword', 'health potion (1)', 'note which reads: \"You must see yourself for who you are, and then speak the truth\"'],
          health: 3,
          isAlive: true,
          friendly: false
        }]
      }]
    ]);

    this.playerLocation = new LocationTracker('ENTRANCE', this.gameMap, this.client);

    this.narrative = `
    The player is a human adventurer capable of mildly athletic feats and some combat ability.
    They have heard there is treasure and danger in this temple.
    `;

    this.start = `You are at the entrance of an super cool looking ancient temple. You possess a sword, sheild, and a small health potion. The stone walls are covered in mysterious glyphs, and the air is thick with anticipation.

Down the dark hall in front of you, you can see it opens into a large antechamber.
    `;

    this.rules = `The user cannot:
        1. Achieve changes to the world aside from the actions of their character (the player must be the subject)
        2. Have their character do something outside of their reasonable ability
        3. Do something inconsistent with the state of the world
            (i.e. talk to someone who is not in the same place as them,
                navigate somewhere that cannot be reached)
        4. Travel to locations or talk to people that are not described in the narrative

        The user is allowed to:
        1. Request actions for the player to perform, even if they don't have a reason to do so
        2. Request information about the world if it can be converted to "looking" or "listening" or "talking with characters" actions
            ie. "whats in my inventory?" -> "look in my inventory and see what I have"
    `;
  }

  private async requestParser(input: string, lastOutput?: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are a request parser and referee for a text adventure game.
            Parse user input into a sequence of actions, where the player is the subject. Speaking counts as an action.
            If the input breaks the rules, try to correct the action to fit the rules. i.e. "kill the goblin" should be "strike at the goblin" and "break the wall with my sword" should be "attempt to break the wall by swinging at it".
            If the input cannot be cast to a valid action, return "ERROR" and a description of the issue.

            If the game is over, either with a win or a loss, no more interaction is allowed.

            The user can request around 2 actions at a time that can be performed in the world.

            The user can navigate to locations that are listed as navigable.

            Say nothing more than the specific requests for actions the user has made.
            The results of those requests will be returned later. No flavor or other text should be included in the response.

            Rules: ${this.rules}
            Narrative context: ${this.narrative}
            Location: ${JSON.stringify(this.playerLocation.getCurrentLocation())}
            ---
            Current state: ${this.currentState}
            Last Output: ${lastOutput || 'none'}
            User input to parse: ${input}`
          },
        ]
      });

      const text = (response.content[0] as Anthropic.TextBlock).text;
      return text;
    } catch (error) {
      return `Error parsing request: ${error.message}`;
    }
  }


  private async gameMaster(action: string, lastOutput: string): Promise<{ changes: string, extraChanges: string, clarifications: string}> {
    try {
      const response = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are the referee for an adventure game. Process the requested action and return the result of the action in the world,
            given the narrative context and the current state of the game as concisely as possible with no flavor. Think carefully about what would result from the player
            performing the action, given only what is possible as described in the narrative.

            In particular, the location of the player before and after the action, the inventory, health of the player and any opponents.

            ALWAYS use the valid locations navigable from the current one in angle brackets <> for the location of the player before and after the action.
            If the location moved to has not been visited yet, indicate that it is a first visit. Otherwise indicate that they are returning to a room they have already visited.

            NEVER use any other location outside of the locations navigable from the current one.

            THE ONLY WAY to set currentLocationName, is if the user requested action is to move to a new location,
            either through an adjoining place or directly. In all other cases, the currentLocationName should not change.

            DO NOT provide a full new game state in the response. Only provide the changes to the game state that result from the action.

            ONLY provide the changes to the game state that result from the action.
            DONT ASSUME ADDITIONAL ACTIONS BESIDES THE ONE THE USER REQUESTED.

            If the player interacts with something that is not important to the narrative context, you can still guage what happened (if anything), but should indicate that
            That even though they interacted with something, it was not important.

            If they try to navigate to a place that is not in the narrative context,
            you should indicate that they don't feel like they want to go there.

            If nothing much has changed, you should say either "no changes" or that "attempted ${action}, but nothing happened because <x>".

            IMPORTANT: If the player asks for hints or tries to focus on what they are doing or can do, you should list that in the clarifications as requests for clarifications.

            IF the player attacks a creature or character, sometimes the attack will land and sometimes it won't.
            When the player is in combat, the creatures will attack them as well as part of the user inflicted changes.

            Current Location: ${JSON.stringify(this.playerLocation.getCurrentLocation())}
            Game state: ${this.currentState}
            Last output: ${lastOutput || 'none'}
            player requested Action: ${action}

            The format of the result should be only a perfect and parsable JSON object with the exact following keys and no more:
            {
              "changes": "concise english language description of what happened in the world as a result of the action ("player did <action> and <result>" or "player went from <old location> to <new location>")"
              "clarifications": "concise english language description of a clarification requested by the player"
            }`
          }
      ]
      });
      debugger;
      // Parse and validate the new state
      const text = (response.content[0] as Anthropic.TextBlock).text;
      const stateChange = JSON.parse(text);
      return stateChange;
    } catch (error) {
      return {changes: `ERROR: ${error.message}`};
    }
  }

  private async gameStateUpdater(stateChange: {changes: string, extraChanges?: string, clarifications?: string}): Promise<void> {

    const response = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [
        {
            role: "user",
            content: `You are the record keeper for an adventure game. Process the change that occurred and return
            the new game state of the game and world.

            Think carefully about what the new state of the game would be, that as closely as possible aligns
            with whats possible in the current location.

            If a creature dies, update the state of the creature to be dead. Do not update or remove a creature state otherwise.

            NEVER UPDATE THE PLAYER_KEY_KNOWLEDGE OR HINTS unless it is specifically mentioned to do so.

            In particular, the inventory, health of the player and any opponents should always
            be updated if they have changed.

            If nothing much has changed, just return the current state of the game and world.

            IMMEDIATELY return the current state in perfect JSON with no other content.

            Narrative context: ${this.narrative}
            Current Location: ${this.playerLocation.getCurrentLocation()}
            Previous Game state: ${this.currentState}
            state change from previous: ${JSON.stringify(stateChange.changes)}
            extra state change from previous: ${stateChange.extraChanges || 'none'}`
        }
        ]
    });

    const text = (response.content[0] as Anthropic.TextBlock).text;
    this.currentState = text;
  }

  private async narrator(state: string, attemptedAction: string, stateChange: {changes: string, extraChanges?: string, clarifications?: string}, lastOutput?: string): Promise<string> {
    try {

      const possibleNavigation = this.playerLocation.getPortals();
      debugger;
      const narratorMessages = [{
        role: "user",
        content: `You are the narrator. Create prose based on the game state and action performed, but be as concise as possible and talk about what just happened, and briefly explain the current state of the game.
        You can hint at possible options for what the player can do next,
        but NEVER say so explicitly what the player can do next, or say the words "hinting at", "suggest", or "suggesting".
        Always refer to the player as "you", since you are telling the story to the player.
        DO NOT ask questions of the player.

        ALWAYS use the current location to describe what's around the player, and what the places they can go from here are! When listing places, don't use angle brackets, just the name of the place in lower case.

        If the player has moved into an unvisited location, introduce the location and describe what's around the player.
        Don't repeat what was already said in the last output.
        IF WHAT JUST HAPPENED WAS NOT A LOCATION CHANGE, DO NOT INTRODUCE THE LOCATION. In other words don't say "you enter the kitchen" if the player was already in the kitchen (so the kitchen is "visited")

        If the player has completed or failed the game, indicate to them that there is no further possibility of interaction.

        Last thing you said: ${lastOutput}

        Current state: ${state}
        Current Location: ${JSON.stringify(this.playerLocation.getCurrentLocation())}

        Possible navigation: ${JSON.stringify(possibleNavigation)}

        IMPORTANT: When in battle or conversation, don't mention the navigable places.
        OTHERWISE ALWAYS mention the navigable places in a natural way.

        what the player attempted was: ${attemptedAction}
        NEVER say that the player succeeded in the action, unless it is described by what just happened.
        What just happened was this: ${stateChange['changes']}



        If a player attempts an action and nothing happens still say that they attempted to do that action and failed.

        ${stateChange.clarifications ? `Clarifications are requested by user, respond using player_hints if they are relevant: ${stateChange.clarifications}` : ''}

        VERY IMPORTANT: Don't mention ANYTHING about the game state other than what just happened, whats around, and what the navigable places are, unless it's relevant to what just happened. Do not say the health, inventory, knowedge of the player.
        NEVER mention anything that the player doesn't know about yet, like things that are behind doors they haven't opened yet.

        Keep flavor text to a minimum. If something happened, try to briefly explain why and connect it to the players action.
        `
      }];


      const response = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: narratorMessages
      });

      const text = (response.content[0] as Anthropic.TextBlock).text;
      return text;
    } catch (error) {
      return `Error generating narrative: ${error.message}`;
    }
  }

  async processText(text: string, previousOutputs: string[]): Promise<TextProcessingResult> {
    try {
      // Step 1: Parse and validate the request
      const action = await this.requestParser(text, previousOutputs[previousOutputs.length - 1]);

      console.log("Parsed action:", action);

      // Step 2: Process the action and update game state
      // First checking if the action is a navigation action and updating the player location
      // if not, then we let the game master handle the action and update the game state
      const locationTrackerResponse = await this.playerLocation.processNavigationAction(action);
      let stateChange = { changes: "", extraChanges: "" };
      if (!locationTrackerResponse.success) {
        stateChange = await this.gameMaster(action, previousOutputs[previousOutputs.length - 1]);
      } else {
        stateChange.changes = `navigated from ${locationTrackerResponse.previousLocationId} to ${locationTrackerResponse.newLocationId}. ${locationTrackerResponse.beenHereBefore ? 'Returning visit.' : `First visit`}`;
        if (!locationTrackerResponse.beenHereBefore && locationTrackerResponse.firstVisitEffect) {
          stateChange.extraChanges = locationTrackerResponse.firstVisitEffect;
        }
      }

      console.log("State change:", stateChange);

      await this.gameStateUpdater(stateChange);

      console.log("Updated game state:", this.currentState);

      // Step 3: Generate narrative response
      const narrative = await this.narrator(this.currentState, action, stateChange);

      console.log("Narrative:", narrative);

      return {
        processedText: narrative,
        timestamp: new Date().toLocaleTimeString()
      };
    } catch (error) {
      return {
        processedText: `Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      };
    }
  }

  initialOutput(): TextProcessingResult {
    return {
      processedText: this.start,
      timestamp: new Date().toLocaleTimeString()
    };
  }
}