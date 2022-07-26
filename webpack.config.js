const path = require("path");
const webpack = require("webpack");

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const filename = (ext) =>
  isDev ? `bundle.${ext}` : `bundle.[chunkhash].${ext}`;

module.exports = {
  mode: "development",

  entry: "./src/js/index.js",
  stats: { warnings: false },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: filename("js")
  },
  devServer: {
    port: 9070,
    open: true,
    hot: true
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: filename("css") }),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader",
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              esModule: false,
            },
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg|png|jpg|jpeg|gif|ico)$/,
        type: 'asset/inline'
      },

      {
        test: /.(scss|css)$/,

        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader"
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: "sass-loader"
          },
        ],
      },
    ],
  },

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: "async",
      minChunks: 1,
      minSize: 30000,
      name: false,
    },
  },
};
