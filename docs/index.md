## ScrimSight

ScrimSight is a web application for analyzing and visualizing data from the game "Overwatch".

It is built using the [Wombat Data Framework](https://github.com/wombat-data/wombat-data-framework), a JavaScript library for building data processing pipelines.

The UI is organized around a central dashboard, which shows a series of widgets and containers, which are ranked according to a relevance score.

The containers are used to group related widgets together, and to provide a way to refine the scope of the data used in the widgets, for example by filtering the data by map or by player.

The widgets are the basic building blocks of the application, and represent the core functionality of ScrimSight.

The users intent is represented as a structured query: a list of attributes that the user is interested in.

Here are the fundamental attributes that users can query on:

* **Player**: A list of players, any players, or not set, meaning not caring about players very much.
* **Map ID**: A list of map IDs, any map, or not set, meaning not caring about maps very much.
* **Round number**: A list of round numbers, any round, or not set, meaning not caring about rounds very much. Only available if Map ID is set.
* **Map Name**: A list of map names, any map, or not set, meaning not caring about maps very much.
* **Mode**: A list of modes, any mode, or not set, meaning not caring about modes very much.
* **Team**: A list of teams, any team, or not set, meaning not caring about teams very much.
* **Hero**: A list of heroes, any hero, or not set, meaning not caring about heroes very much.
* **Metric**: A list of metrics, any metric, or not set, meaning not caring about metrics very much.
* **Time**: A list of times, any time, or not set, meaning not caring about times very much.
* **Date**: A date range, any date, or not set, meaning not caring about dates very much.

This intent is represented by an object, which the user can refine by setting the attributes to specific values or by clearing them to be unset.

```typescript
interface Intent {
  playerName?: string[]; // A list of players. Unset means not caring about players.
  mapId?: string[]; // A list of map IDs. Unset means not caring about maps.
  roundNumber?: (1 | 2 | 3)[]; // A list of round numbers. Unset means not caring about rounds.
  mapName?: string[]; // A list of map names. Unset means not caring about maps.
  mode?: string[]; // A list of modes, or "*" for any mode. Unset means not caring about modes.
  team?: string[]; // A list of teams. Unset means not caring about teams.
  hero?: string[]; // A list of heroes. Unset means not caring about heroes.
  metric?: string[]; // A list of metrics. Unset means not caring about metrics.
  time?: [number, number]; // A time range in seconds. Unset means not caring about times.
  date?: [string, string]; // A date range in YYYY-MM-DD format. Unset means not caring about dates.
}
```

The intent is processed by a series of bidders, one for each type of widget. These bidders return a list of widgets that match the intent, with their corresponding intents.

```typescript
interface WidgetBid {
  widget: Widget;
  intent: Intent;
}
```

For example, if the user's intent is `{ mapId: [1], hero: ["Reaper", "Doomfist"] }` and a widget declares `{ mapId: [1], hero: ["Reaper"] }`, then the relevance score will be high, but lower than if the widget declares `{ mapId: [1], hero: ["Reaper", "Doomfist"] }`.

Once the bidders have returned their bids, the bids are sorted by relevance score, and the top bids are displayed in the dashboard.

They are organized into containers, which are used to group related widgets together, and to provide a way to refine the intent.

There is an outermost container, which contains all the bids, and can contain other containers.

The widgets and child containers inside a parent container are ranked according to a relevance score, which is computed by comparing the user's intent to the intent of the widgets and child containers inside the parent container.

The relevance score of a container is the sum of the relevance scores of the widgets and child containers inside the container.

The relevance score of a widget is computed by comparing the user's intent to the intent of the widget.

