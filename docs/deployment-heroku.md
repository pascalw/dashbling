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

[1] This is required because Heroku doesn't install `devDependencies`.
