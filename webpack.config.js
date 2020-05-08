const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 把非js代码单独打包成一个静态资源文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === "development";

const config = {
  target: "web",
  entry: path.join(__dirname, "src/index.js"),
  output: {
    filename: "bundle.[hash:8].js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: "vue-loader", //解析和转换.vue文件
      },
      {
        test: /.jsx$/,
        loader: "babel-loader",
      },
      {
        test: /\.(gif|png|jpg|jpeg|svg)$/,
        loader: "url-loader",
        options: {
          limit: 1024,
          name: "[hash]-dd.[ext]",
        },
      },
      {
        test: /\.styl(us)?$/,
        use: [
          // 生产环境时把样式写在一个单独的css文件里，css-loader处理之后的内容已经够了
          isDev ? "vue-style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true, // 在使用stylus-loader时会自动生成sourceMap,postcss-loader也可以生成sourceMap，但是当前面有处理器生成sourceMap后，可以直接使用前面生成的sourceMap来用，这样效率更快一些
            },
          },
          {
            loader: "stylus-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin(),
  ],
};

if (isDev) {
  // 此选项控制是否生成，以及如何生成 source map
  config.devtool = "#cheap-module-eval-source-map";
  config.devServer = {
    port: 8000,
    host: "0.0.0.0",
    overlay: {
      errors: true,
    },
    hot: true,
  };
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  config.entry = {
    app: path.join(__dirname, "src/index.js"),
    vendor: ["vue"],
  };
  // chunk可以理解entry中的不同节点，如果使用hash，所有js都用同一个hash，是整个应用的hash
  // 使用chunkHash每个chunk都会有单独的hash
  config.output.filename = "[name].[chunkHash:8].js";
  config.plugins.push(
    new MiniCssExtractPlugin({
      // contentHash是根据文件内容得到的hash值
      filename: "styles.[contentHash:8].css",
    })
  );
  config.optimization = {
    splitChunks: {
      chunks: "async",
    },
    runtimeChunk: {
      name: entrypoint => `manifest.${entrypoint.name}`
    }
  };
}

module.exports = config;
