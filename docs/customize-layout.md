# Customize the global layout

By default, Dashbling uses a [Flexbox based layout](https://github.com/pascalw/dashbling/blob/master/packages/client/layouts/FlexLayout.scss).

If this doesn't suit your needs however it's possible to use a different layout by passing it to your `Dashboard` instance:

```js
export default props => {
  return (
    <Dashboard layout={myCustomLayout}>
      [...]
    </Dashboard>
  );
};
```

A layout is an object that specifies which class names are applied to certain DOM elements. The following keys are expected to be present in your layout:

* `dashboard` - this is the outer-most component in the Dashbling DOM.
* `metaContainer` - this is the container holding the `last updated` information.
* `widgetContainer` - this is the container containing the widgets.
* `widget` - this class is applied to each widget.

It's most convenient to create a custom layout using a CSS module. Simply create a a (S)CSS file somewhere:

```scss
// myCustomLayout.scss

.dashboard {
  // dashboard styles here
}

.metaContainer {
  // metaContainer styles here
}

.widgetContainer {
  // widgetContainer styles here
}

.widget {
  // widget styles here
}
```

Import it and pass it to your dashboard:

```js
import React from "react";

import { Dashboard } from "@dashbling/client/components";
import myCustomLayout from "./myCustomLayout.scss";

export default props => {
  return (
    <Dashboard layout={myCustomLayout}>
		[...]
    </Dashboard>
  );
};
```

For example a 3 column grid layout could look like this:

```scss
$base-widget-size: 300px;

.dashboard {
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
}

.metaContainer {
  margin: auto 1em 1em;
}

.widgetContainer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.5em;
}

.widget {
  flex: 1 1 $base-widget-size;
  min-width: $base-widget-size;
  min-height: $base-widget-size;

  padding: 0.75em;
  margin: 0.5em;
  color: #fff;
  word-wrap: break-word;
  hyphens: auto;

  position: relative;
}
```