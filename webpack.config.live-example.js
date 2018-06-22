const path = require( "path" );

module.exports = {

    mode: "development",
    entry: "./src/live-example.js",
    output: {

        filename: "live-example.js",
        path: path.resolve( __dirname, "docs" ),
        libraryTarget: "umd"

    },
    devServer: {

        contentBase: "./docs",
        compress: true,
        port: process.env.PORT || 5002,
        host: "0.0.0.0",
        disableHostCheck: true

    },
    module: {

        rules: [

            {

                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"

            },
            {

                test: /\.svg$/,
                exclude: /node_modules/,
                loader: "svg-react-loader"

            },
            {

                test: /\.scss/,
                exclude: /node_modules/,
                loader: [ "style-loader", "css-loader", "sass-loader" ]

            }

        ]

    }

};