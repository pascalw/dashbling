# Running multiple dashboards

A single Dashbling instance can run mulitple dashboards.

This can be achieved in several ways, but the gist is that you need to render a certain dashboard based on URL or location hash.

By default Dashbling projects render the only available dashboard like this (see the `index.js` file in your dashboard project):

```js
import Dashboard from "./Dashboard";
dashbling.start(document.getElementById("root"), Dashboard);
```

Chosing a specific dashboard to render based on the location hash:

```js
import Dashboard from "./Dashboard";
import Dashboard2 from "./Dashboard2";

const root = document.getElementById("root");

const dashboards = {
  "#dasboard1": Dashboard,
  "#dashboard2": Dashboard2
};

const dashboard = () => dashboards[window.location.hash] || Dashboard;
dashbling.start(root, dashboard());

window.addEventListener("hashchange", () => {
  dashbling.render(root, dashboard());
}, false);
```

Beware though that the Dashbling server does not know (or care) about your frontend dashboards, so all data published by the server will be sent to all clients even if they might be serving a dashboard that doesn't use that data.