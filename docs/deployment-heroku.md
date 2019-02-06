# Deploying on Heroku

Deploying a Dashbling app on Heroku is easy.

1. Add a `Procfile` in the root of your project with the following contents:

```
web: yarn start
```

2. Add a `heroku-postbuild` script to your `package.json`:

```diff
"scripts": {
   "start": "NODE_ENV=${NODE_ENV:-development} dashbling start",
-  "build": "dashbling compile"
+  "build": "dashbling compile",
+  "heroku-postbuild": "yarn build"
},
```

3. Commit your changes to and push to Heroku.
4. You're done!

## Persistent history

This is not required but you might want to enable the MongoDB history adapter on Heroku. Dashbling stores event history on the filesystem by default, but the filesystem is not persistent on Heroku.

If you're only pulling data into your dashboard this is not really an issue, because Dashbling will just pull in all data again when it's restarted. However if you're pushing data into Dashbling you definitely want to store it persistently.

In Heroku, enable the `mLab MongoDB` add-on. Then follow the steps outlined in the [MongoDB history adapter docs](../packages/mongodb-history/README.md).

