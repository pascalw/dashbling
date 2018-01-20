const path = require("path");
const webpack = require("webpack");
const HTML = require("html-webpack-plugin");
const Clean = require("clean-webpack-plugin");

const exclude = modulePath => {
  return (
    /node_modules/.test(modulePath) &&
    !/node_modules\/@dashbling/.test(modulePath) &&
    !/node_modules\/.*?dashbling-widget.*/.test(modulePath)
  );
};

module.exports = projectPath => {
  const env = process.env.NODE_ENV || "development";
  const isProd = env === "production";
  const out = path.join(projectPath, "./dist");

  const plugins = [
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(env) }),
    new Clean([out], { root: projectPath }),
    new HTML({
      template: path.join(projectPath, "./index.html"),
      inject: true,
      minify: isProd
        ? {
            removeComments: true,
            collapseWhitespace: true
          }
        : false
    })
  ];

  if (isProd) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
      new webpack.optimize.UglifyJsPlugin()
    );
  } else {
    // dev only
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    );
  }

  return {
    entry: {
      app: [
        path.join(projectPath, "./index.js"),
        ...(isProd ? [] : ["webpack-hot-middleware/client"])
      ]
    },
    output: {
      path: out,
      filename: "[name].[hash].js",
      publicPath: "./"
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: exclude,
          loader: "babel-loader",
          options: {
            extends: path.join(__dirname, ".babelrc")
          }
        },
        {
          test: /\.s?css$/,
          exclude: exclude,
          use: [
            { loader: "style-loader" },
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: "[path][name]__[local]--[hash:base64:5]"
              }
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: path.join(__dirname, "postcss.config.js")
                }
              }
            },
            { loader: "sass-loader" }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          loader: "file-loader",
          exclude: exclude
        }
      ]
    },
    plugins: plugins,
    devtool: !isProd && "cheap-module-source-map"
  };
};
