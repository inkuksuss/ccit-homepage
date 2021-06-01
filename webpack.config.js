const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, 'assets', 'js', 'main.js'); // 파일 입력
const OUTPUT_DIR = path.join(__dirname, 'static'); // 파일 변환


const config = {
    devtool: "inline-source-map",
    mode: MODE,
    entry: ["@babel/polyfill", ENTRY_FILE],
    output: {
        path: OUTPUT_DIR,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
            test: /\.(js)$/,
            use: [
                {
                loader: "babel-loader"
                }
            ]
            },
            {
            test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                        {
                        loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                        'autoprefixer',
                                            {
                                            // Options
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ],
};

module.exports = config;