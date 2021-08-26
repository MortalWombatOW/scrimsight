const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/]
            },
            {
                test: /\.worker\.js$/,
                exclude: [/node_modules/],
                use: { loader: 'worker-loader' }
            },
            {
                test: /\.html$/i,
                exclude: [/node_modules/],
                use: { loader: 'html-loader' }
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                      loader: 'url-loader',
                      options: {
                        limit: 8192,
                      },
                    },
                  ],
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    
    output: {
        publicPath: '/dist/',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/')
    }
};
