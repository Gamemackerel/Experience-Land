import Anthropic from "@anthropic-ai/sdk";

interface Portal {
  option: string;  // Display name for the portal (e.g., "wooden door", "dark hallway")
  destination: string;  // LocationId of where this portal leads
}

interface Location {
  id: string;           // Unique identifier for this location
  name: string;        // Display name of the location
  description: string; // Full description of the location
  navigable: Portal[];   // Available exits/connections from this location
  firstVisitEffect: string;  // Optional: Special description for first visit
  isVisited: boolean;  // Tracking if player has been here before
  objects: string[];
  npcs: string[];
}

export type LocationGraph = Map<string, Location>;

export class LocationTracker {
  private locationGraph: LocationGraph;
  private currentLocationId: string;
  private aiClient: Anthropic;

  constructor(initialLocationId: string, gameMap: LocationGraph, aiClient: Anthropic) {
    this.locationGraph = gameMap;
    this.currentLocationId = initialLocationId;
    this.aiClient = aiClient;
  }

  getCurrentLocation(): Location {
    return this.locationGraph.get(this.currentLocationId)!;
  }

  getPortals(): Portal[] {
    return this.getCurrentLocation().navigable
  }

  markLocationVisited(locationId: string) {
    const location = this.locationGraph.get(locationId);
    if (location) {
      location.isVisited = true;
    }
  }

  // This would be called by the navigation agent
  async processNavigationAction(action: string): Promise<{
    success: boolean;
    newLocationId?: string;
    previousLocationId?: string;
    beenHereBefore?: boolean;
    firstVisitEffect?: string;
    error?: string
  }> {
    // Extract portal name from action with ai client
    const response = await this.aiClient.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 8,
      system: "You will be given a list of navigation options and a user action. Your job is to extract the destination from the action using the navigation options to determine the exact destination name, and provide ONLY that destination name in the response with no other content. If the action is not a navigation action, or the destination cannot be determined from the action, respond with \"null\". Do not respond with anything else.",
      messages: [
          {
            role: "user",
            content: `Action requested from user: ${action}
            Navigation options: ${JSON.stringify(this.getPortals())}
        `
        },
        {
          role: "assistant",
          content: "destination:"
        }

      ]
    });

    const text = (response.content[0] as Anthropic.TextBlock).text;
    const newLocationId = text.replace("destination:", "").trim();

    if (newLocationId === "null") {
      return {
        success: false,
        error: "No navigation action detected."
      };
    }

    const previousLocationId = this.currentLocationId;
    this.currentLocationId = newLocationId;

    const beenHereBefore = this.getCurrentLocation().isVisited;
    if (!beenHereBefore) {
      this.markLocationVisited(newLocationId);
    }

    return {
      success: true,
      previousLocationId,
      newLocationId,
      firstVisitEffect: this.getCurrentLocation()?.firstVisitEffect || '',
      beenHereBefore
    };
  }
}