const webpack = require("webpack");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const react = new webpack.ProvidePlugin({
    React: "react",
});
module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "../Assets/Site/Js/dist/bundle.js",
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                    plugins: [
                        "@babel/plugin-transform-runtime",
                        "transform-class-properties",
                    ],
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [react],
};
