const path = require("path");

const basePath = process.cwd();
const env = process.env.NODE_ENV || "development";
const isProd = env === "production";
const out = path.join(basePath, "./dist");

const webpack = require("webpack");
const HTML = require("html-webpack-plugin");
const Clean = require("clean-webpack-plugin");

const plugins = [
  new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(env) }),
  new Clean([out], { root: basePath }),
  new HTML({
    template: path.join(basePath, "./index.html"),
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
    new webpack.NamedModulesPlugin()
  );
}

module.exports = {
  entry: {
    app: path.join(basePath, "./index.js"),
    ...(!isProd ? { hot: "webpack-hot-middleware/client" } : {})
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
        exclude: modulePath => {
          return (
            /node_modules/.test(modulePath) &&
            !/node_modules\/dashbling\/client/.test(modulePath)
          );
        },
        loader: "babel-loader",
        options: {
          extends: path.join(__dirname, ".babelrc")
        }
      },
      {
        test: /\.scss$/,
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
        test: /\.(png|svg)$/,
        loader: "file-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: plugins,
  devtool: !isProd && "eval"
};
