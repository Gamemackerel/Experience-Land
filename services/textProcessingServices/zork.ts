import { TextProcessBase, TextProcessingResult } from './textProcessBase';
import Anthropic from '@anthropic-ai/sdk';

export class Zork extends TextProcessBase {
  private client: Anthropic;
  private currentState: string;
  private narrative: string;
  private start: string;
  private rules: string;
  private map: { [key: string]: { description: string, navigable: string[] } };

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new Anthropic({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });

    // Initialize with default state
    this.currentState = `{
        "location": "<ENTRANCE>",
        "inventory": ["sword", "sheild", "health potion (1)"],
        "player_health": "3",
        "probable_next_player_actions": ["go down the hallway to the antechamber", "look around at the entrance", "look behind at where they came from"],
        "existing_player_knowledge": [],
        "state_of_other_characters": [],
        "state_of_objects": []
    }
    `;


    this.map = {
      '<ENTRANCE>': {
        description: 'You are at the entrance of an ancient temple. The stone walls are covered in mysterious glyphs, and the air is thick with anticipation.',
        navigable: ['<ANTECHAMBER>'],
      },
      '<ANTECHAMBER>': {
        description: 'You are in a large room down the hall in front of you. It contains 3 doors to navigable locations. ROOM 1 is to the east, ROOM 2 is to the west, and ROOM 3 is to the north.',
        navigable: ['<ENTRANCE>', '<ROOM 1>', '<ROOM 2>', '<ROOM 3>'],
      },
      '<ROOM 1>': {
          description: 'a small room, with a painting on the wall. A painting of a goblin in a cave, with a sign that reads: "I am a goblin in a cave. Say these words and see the truth.". The phrase and where it was found are added to the player knowledge. If the player says the words in this room, nothing happens.',
          navigable: ['<ANTECHAMBER>', '<ROOM 2> through <ANTECHAMBER>', '<ROOM 3> through <ANTECHAMBER>'],
      },
      '<ROOM 2>': {
        description: `a small room, with a mirror on the wall. If the player looks into the mirror and
        says the words "I am a goblin in a cave" which they learned in the other room, the mirror fragment into a million shards,
        and a hallway is left behind to the treasure room. THIS IS ONLY POSSIBLE IF THAT PHRASE IS IN THE PLAYER KNOWLEDGE.
        DO NOT HINT AT THIS.
        If that happens, the player is congratulated for finding the treasure and the game is over. No more interaction is possible.`
        , navigable: ['<ANTECHAMBER>', '<ROOM 1> through <ANTECHAMBER>', '<ROOM 3> through <ANTECHAMBER>']
      },
      '<ROOM 3>': {
        description: `a small room with a goblin in the corner, who, IF STILL ALIVE, attacks when you enter.
        In order to fight the goblin, the player is allowed one action per turn.
        If the player hits the goblin 3 times, the goblin is killed, and the player can continue.
        Be sure to update the state of the goblin.
        If the player is hit 3 times, they are killed, the game is over and no more interaction is possible.
        The health potion can be used to restore 2 hp.`,
        navigable: ['<ANTECHAMBER>', '<ROOM 2> through <ANTECHAMBER>', '<ROOM 1> through <ANTECHAMBER>']
      }
    };

    this.narrative = `
    The player is a human adventurer capable of mildly athletic feats and some combat ability.

    The player starts in the <ENTRANCE> of a large temple.
    There is a large room down the hall in front of them (the <ANTECHAMBER>). It contains 3 doors to navigable locations.

    to the east is <ROOM 1>:
    a small room, with a painting on the wall.
    A painting of a goblin in a cave, with a sign that reads:
    "I am a goblin in a cave. Say these words and see the truth."
    If you say the words in this room, nothing happens.

    to the west is <ROOM 2>:
    a small room, with a mirror on the wall. If the player looks into the mirror and
    says the words "I am a goblin in a cave" which they learned in the other room, the mirror fragment into a million shards,
    and a hallway is left behind to the treasure room.
    The player is congratulated for finding the treasure and the game is over. No more interaction is possible.

    to the north is <ROOM 3>:
    a small room with a goblin. IF STILL ALIVE, attacks when you enter. otherwise it is lifeless.
    In order to fight the goblin, the player is allowed one action per turn.
    If the player hits the goblin 3 times, the goblin is killed, and the player can continue.
    Be sure to update the state of the goblin.
    If the player is hit 3 times, they are killed, the game is over and no more interaction is possible.
    The health potion can be used to restore 2 hp.
    `;

    this.start = `
    You are at the entrance of an ancient temple. The stone walls are covered in mysterious glyphs, and the air is thick with anticipation.
    Down the dark hall in front of you, you can see it opens into a large antechamber.
    `;

    this.rules = `The user cannot:
        1. Achieve changes to the world aside from the actions of their character (the player must be the subject)
        2. Have their character do something outside of their reasonable ability
        3. Do something inconsistent with the state of the world
            (i.e. talk to someone who is not in the same place as them,
                navigate somewhere that cannot be reached)
        4. Travel to locations or talk to people that are not described in the narrative
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
            If the input breaks the rules, say "ERROR" and return an error message describing the issue.

            The user can request around 2 actions at a time that can be performed in the world.

            Say nothing more than the specific requests for actions the user has made.
            The results of those requests will be returned later. No flavor or other text should be included in the response.

            Rules: ${this.rules}
            Narrative context: ${this.narrative}
            ---
            Current state: ${this.currentState}
            Last Output: ${lastOutput || 'none'}
            User input to parse: ${input}`
          },
        ]
      });

      return response.content[0].text;
    } catch (error) {
      return `Error parsing request: ${error.message}`;
    }
  }


  private async gameMaster(action: string, lastOutput: string): Promise<{ newlocation: string, changes: string}> {
    const messagesForGameMaster = [
        {
          role: "user",
          content: `You are the referee for an adventure game. Process the requested action and return the result of the action in the world,
          given the narrative context and the current state of the game as concisely as possible with no flavor. Think carefully about what would result from the player
          performing the action, given only what is possible as described in the narrative.

          In particular, the location of the player before and after the action, the inventory, health of the player and any opponents.

          ALWAYS use the valid locations navigable from the current one in angle brackets <> for the location of the player before and after the action.

          NEVER use any other location outside of the locations navigable from the current one.

          DO NOT provide a full new game state in the response. Only provide the changes to the game state that result from the action.

          ONLY provide the changes to the game state that result from the action.
          DONT ASSUME ADDITIONAL ACTIONS BESIDES THE ONE THE USER REQUESTED.

          If the player interacts with something that is not important to the narrative context, you should indicate that
          nothing happened in response to the action. If they try to navigate to a place that is not in the narrative context,
          you should indicate that they don't feel like they want to go there.

          If nothing much has changed, you should say that "attempted ${action}, but nothing happened because <x>".

          IF the player attacks a creature or character, sometimes the attack will land and sometimes it won't.
          When the player is in combat, the creatures will attack them as well as part of the user inflicted changes.

          Location: ${JSON.stringify(this.map[JSON.parse(this.currentState)['location']])}
          Game state: ${this.currentState}
          Last output: ${lastOutput || 'none'}
          player requested Action: ${action}

          The format of the result should be only a perfect and parsable JSON object with the exact following keys and no more:
          {
            "newlocation": "<LOCATIONNAME>",
            "changes": "english language description of what happened in the world as a result of the action ("player did <action> and <result>" or "player went from <old location> to <new location>")"
          }`


        }
    ];
    try {
      const response = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages:messagesForGameMaster
      });

      // Parse and validate the new state
      const stateChange = JSON.parse(response.content[0].text);
      return stateChange;
    } catch (error) {
      return {newlocation: this.currentState, changes: `ERROR: ${error.message}`};
    }
  }

  private async gameStateUpdater(stateChange: {newlocation: string, changes: string}): Promise<void> {

    const response = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [
        {
            role: "user",
            content: `You are the record keeper for an adventure game. Process the change that occurred and return
            the new game state of the game and world.

            Think carefully about what the new state of the game would be, that as closely as possible aligns
            with both the narrative context, and whats possible in the current location.

            If the location has changed, always update the location of the player to the new location.

            If a creature dies, update the state of the creature to be dead. Do not update or remove a creature state otherwise.

            NEVER update the player knowledge or probable next player actions to anything that isn't in the narrative context.

            In particular, the location of the player, the inventory, health of the player and any opponents should always
            be updated if they have changed. And the next player actions should always be cleared and replaced with
            new ones that reflect the current state of the game and funnel the player to do things mentioned in the narrative.

            If nothing much has changed, just return the current state of the game and world.

            NEVER update the player knowledge or probable next player actions to anything which has inforation that the player doesn't know yet.
            The player would only ever know things like what's behind doors, if they have visited the location before and seen it.
            The player knowledge is only updated upon learning key information. And things are rarely removed from the player knowledge, only if the player learned that something is no longer true.

            ALWAYS list all the navigable locations from the new location as possible next player actions.

            ALWAYS return the current state in perfect JSON.

            Narrative context: ${this.narrative}
            New Location Overview: ${JSON.stringify(this.map[stateChange['newlocation']])}
            Previous Game state: ${this.currentState}
            Previous Location: ${JSON.parse(this.currentState)['location']}
            state change from previous: ${JSON.stringify(stateChange)}`
        }
        ]
    });

    const newState = response.content[0].text;
    this.currentState = newState;
  }

  private async narrator(state: string, stateChange: {newlocation: string, changes: string}, lastOutput?: string): Promise<string> {
    try {

      const narratorMessages = [{
        role: "user",
        content: `You are the narrator. Create prose based on the game state and action performed, but be as concise as possible and talk about what just happened, and briefly explain the current state of the game.
        You can hint at possible options for what the player can do next,
        but NEVER say so explicitly what the player can do next, or say the words "hinting at", "suggest", or "suggesting".
        Always refer to the player as "you", since you are telling the story to the player.

        ALWAYS use the current location to describe what's around the player, and what the navigable places are! When listing places, don't use angle brackets, just the name of the place in lower case.

        Don't repeat what was already said in the last output. IF THE CHANGE WAS NOT A LOCATION CHANGE, DO NOT INTRODUCE THE LOCATION.

        Last thing you said: ${lastOutput}

        Current state: ${state}
        Current Location: ${JSON.stringify(this.map[JSON.parse(this.currentState)['location']])}

        When in battle, don't mention the navagable places.

        NEVER say that the player does an action, unless it is described by what just happened.
        What just happened was this: ${stateChange['changes']}

        VERY IMPORTANT: Don't mention ANYTHING about the game state other than what just happened, whats around, and what the navigable places are, unless it's relevant to what just happened. Do not say the health, inventory, knowedge of the player.
        NEVER mention anything that the player doesn't know about yet, like things that are behind doors they haven't opened yet.
        VERY IMPORTANT: If nothing much has happened, or the player doesn't feel like or cannot do the thing, then just say that "nothing happened" and don't reiterate the whole state.
        Keep flavor text to a minimum. If something happened, try to briefly explain why and connect it to the players action.
        `
      }];
    //   debugger;
      const response = await this.client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: narratorMessages
      });

      this.narrative = response.content[0].text;
      return this.narrative;
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
      const stateChange = await this.gameMaster(action, previousOutputs[previousOutputs.length - 1]);

      console.log("World change:", stateChange);

      await this.gameStateUpdater(stateChange);

      console.log("Updated game state:", this.currentState);

      // Step 3: Generate narrative response
      const narrative = await this.narrator(this.currentState, stateChange);

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