var path = require("path");

module.exports = {
  mode: "production",
  entry: "./background/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "background.js"
  },
  resolve: {
    extensions: [".ts"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig-bg.json"
            }
          }
        ]
      }
    ]
  }
};
