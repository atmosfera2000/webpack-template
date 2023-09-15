const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin")

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        hot: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html')
        }),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public', 'assets'),
                    to: path.resolve(__dirname, 'dist'),
                }
            ]
        }),        
    ],    
    module: {
        rules: [
            {
                test: /\.(jpge?g|png)$/i,
                type: 'asset',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    {
                        loader: 'css-loader',
                        options: {
                            url: {
                                filter: url => url.includes('img') ? false : true,
                            }
                        },
                    },                     
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'autoprefixer'
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ],
            },        
        ],
    },
    optimization: {
        minimizer: [
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                        ],
                    },
                }
            }),
            new ImageminWebpWebpackPlugin({
                config: [{
                    test: /\.(jpe?g|png)/,
                    options: {
                      quality:  65
                    }
                  }],
            })
        ]
    }
}