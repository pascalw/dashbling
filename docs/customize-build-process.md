# Customize Dashbling build process

Dashbling uses Webpack under the hood to build your dashboard.

It's possible to customize the webpack configuration. To do this, specify a `webpackConfig` property in your `dashbling.config.js` as follows:

```js
module.exports = {
  webpackConfig: config => {
    // return modified config
    // or even completely custom config.
    //
    // Example:
    // config.module.rules.push({
    //   test: /\.jpg$/,
    //   loader: "file-loader"
    // });
    return config;
  }
};
```

The default Webpack configuration can be viewed [here](https://github.com/pascalw/dashbling/blob/master/packages/build-support/webpack.config.js).