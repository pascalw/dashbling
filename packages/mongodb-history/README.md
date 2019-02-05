# Dashbling MongoDB history adapter

This is a History adapter for Dashbling, storing data in MongoDB.

By default, Dashbling stores history data on the filesystem.
This adapter is especially well suited if you run on environments where the filesystem is not persistent, for example on Heroku.

## Usage

Add the dependency to your project:

```sh
yarn add @dashbling/mongodb-history # or npm install --save @dashbling/mongodb-history
```

And plug it into your `dashbling.config.js`:

```js
const {
  createHistory: createMongoHistory
} = require("@dashbling/mongodb-history");

module.exports = {
  /* ... */
  eventHistory: createMongoHistory(process.env.MONGODB_URI)
  /* ... */  
};
```

If you don't want to run MongoDB in development you can also conditionally use MongoDB like so:

```js
/* dashbling.config.js */

const {
  createHistory: createMongoHistory
} = require("@dashbling/mongodb-history");

const { createFileHistory } = require("@dashbling/core/history");

const history = () => {
  if (process.env.MONGODB_URI) {
    return createMongoHistory(process.env.MONGODB_URI);
  } else {
    const eventHistoryPath = require("path").join(
      process.cwd(),
      "dashbling-events"
    );
    return createFileHistory(eventHistoryPath);
  }
};

module.exports = {
  /* ... */
  eventHistory: history()
  /* ... */  
};
```

