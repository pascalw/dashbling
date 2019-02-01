# Getting started with Dashbling

*Dashbling requires NodeJS 8.9.0 or higher.*

```shell
yarn create @dashbling/dashboard my-dashboard # or `npx @dashbling/create-dashboard my-dashboard` if you're not using Yarn
cd my-dashboard
yarn start # or `npm start`
```

**Note: current versions of Yarn do not support `yarn create` with scoped packages. Use `npx` instead if `yarn create` doesn't work. Dependencies will still be managed by Yarn if `yarn` is in your `$PATH`.**

Now open http://localhost:3000/ in your browser to see your dashboard.

## Files and directories

* **dashbling.config.js** - main configuration file.
* **Dashboard.js** - main dashboard definition.
  * This is a React component that defines which Widgets are rendered.
* **index.html** - HTML boilerplate
* **index.js** - javascript boilerplate.
* **jobs** - directory where jobs can be defined.
* **styles** - where global (S)CSS lives.
* **widgets** - directory where widget components can be defined.

Note that Dashbling does not care about the directory structure at all, so adapt to your own taste!

The guide below describes the process of developing and running your Dashbling dashboard.
There's also an [example](https://github.com/pascalw/dashbling/tree/master/example) available in the repo, and a live [demo](https://dashbling.herokuapp.com/).

## Deployment

For production use it's recommended to precompile your dashboard - you can do this by running `yarn build` from the root of your project.
Running the server with `NODE_ENV=production yarn start` will make use of the compiled dashboard and disable all dev tools.

## Writing a custom widget

Widgets in Dashbling are just React components. By convention, widgets make use of the `@dashbling/client/Widget` component to ensure consistent looking widgets and provide some often needed functionality out of the box. This however is not required - a widget can return any HTML!

Most widgets need data to display. In Dashbling, widget data is provided by React component props. A simple `Hello` widget might look like this:

```js
import React from "react";
import { Widget } from "@dashbling/client/Widget";

export const HelloWidget = (props) => {
  return (
    <Widget>
    	hello ${props.name}!
    </Widget>
  )
};
```

Notice that the widget doesn't care where the data is coming from. All it knows is that it should receive a `name` prop and display that.

When using widgets in your dashboard you bind data to the widgets using the `connect` function:

```js
import { connect } from "@dashbling/client/dashbling";

const HelloWorld = connect("hello-world")(HelloWidget);

export default props => {
  return (
    <Dashboard>
      <HelloWorld />
    </Dashboard>
  );
};
```

Here we define that our `HelloWorld` widget should be fed with data from the `hello-world` event. This means that any time a `hello-world` event is sent by the Dashboard backend, the `HelloWorld` widget will automatically be updated with the event data.

As mentioned before, Widgets are simply React components. This means that you can use any React component inside your widgets, for graphs, charts, progress bars, etc.

## Getting data into your dashboard

There are a number of ways to get data in your dashboard:

1. Push data into your dashboard via HTTP
2. Pull data into your dashboard by using jobs
3. Pull data into your dashboard by using streams

### Pushing data into your dashboard

Pushing data requires a token for security reasons. Dashbling uses the configured `authToken`, or generates a random token (if none is configured).

```sh
curl -XPOST -H "Content-Type: application/json" \
			-H "Authorization: bearer YOUR_AUTH_TOKEN" \
			-d '{"any json data": "here"}'
			http://localhost:3000/events/EVENT_ID_HERE
```

Following the `HelloWorld` example above we could push a name into the dashboard like this:

```sh
curl -XPOST -H "Content-Type: application/json" \
			-H "Authorization: bearer YOUR_AUTH_TOKEN" \
			-d '{"name": "world"}' \
			http://localhost:3000/events/hello-world
```

### Pulling data into your dashboard using jobs

Dashbling supports `jobs`: functions that are invoked at specified intervals and are expected to publish events.

A typical job looks something like this:

```js
module.exports = async function myJob(sendEvent) {
  const response = await fetch(`https://ipv4.icanhazip.com/`);
  const ipAddress = await response.text();

  const event = { ipAddress };
  sendEvent("myEventId", event);
};

```

To have Dashbling run this function periodically we configure it in the `dashbling.config.js`:

```js
module.exports = {
  jobs: [
    {
      schedule: "*/5 * * * *",
      fn: require("./jobs/myJob")
    }
  ]
};
```

Each job should have a schedule (cron expression) and a function to run. Functions can also be defined inline:

```js
module.exports = {
  jobs: [
    {
      schedule: "*/5 * * * *",
      fn: sendEvent => sendEvent("myEvent", { message: "hello world! " })
    }
  ]
};
```

Of course, you're free to do anything you want inside these functions!
A single job can also publish multiple events.

## Pulling data into your dashboard using streams

Besides running scheduled jobs like above it's also possible to hold a reference to the `sendEvent` function from the start.
This allows you to build any custom logic that pulls in data into your dashboard, for example using streams.

To get access to the `sendEvent` function you can register an `onStart` function in the `dashbling.config.js`:

```js
module.exports = {
  onStart: (sendEvent) => {
    initializeStreamListener(sendEvent);
  }
};
```
