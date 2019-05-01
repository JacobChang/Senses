var path = require("path");
var webpack = require("webpack");

function resolve(filePath) {
    return path.join(__dirname, filePath);
}

var babelOptions = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    browsers: ["last 2 versions"]
                },
                modules: false
            }
        ]
    ]
};

var isProduction = process.argv.indexOf("-p") >= 0;
var port = process.env.SUAVE_FABLE_PORT || "8085";
console.log(
    "Bundling for " + (isProduction ? "production" : "development") + "..."
);

module.exports = {
    devtool: "source-map",
    entry: resolve("./Client.fsproj"),
    mode: isProduction ? "production" : "development",
    output: {
        path: resolve("./public/js"),
        publicPath: "/js",
        filename: "bundle.js"
    },
    devServer: {
        port: 8086,
        proxy: {
            "/api/*": {
                target: "http://localhost:" + port,
                changeOrigin: true
            }
        },
        historyApiFallback: true,
        contentBase: resolve("./public"),
        hot: true,
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.fs(x|proj)?$/,
                use: {
                    loader: "fable-loader",
                    options: {
                        babel: babelOptions,
                        define: isProduction ? [] : ["DEBUG"]
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions
                }
            }
        ]
    },
    plugins: isProduction
        ? []
        : [
              new webpack.HotModuleReplacementPlugin(),
              new webpack.NamedModulesPlugin()
          ]
};
