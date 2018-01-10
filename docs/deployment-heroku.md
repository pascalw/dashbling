# Deploying on Heroku

Deploying a Dashbling app on Heroku is easy.

1. Move the `@dashbling/build-support` dependency from `devDependencies` to `dependencies` and run `yarn install` to update the `yarn.lock`. [1]
2. Add a `Procfile` in the root of your project with the following contents:

```
web: yarn build && yarn start
```

3. Commit your changes to and push to Heroku.
4. You're done!

[1] This is required because Heroku doesn't install `devDependencies`.