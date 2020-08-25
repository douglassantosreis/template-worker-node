const path = require('path');

const { IgnorePlugin, HotModuleReplacementPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const nodeExternals = require('webpack-node-externals');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const config = {
    target: 'node',
    entry: path.join(__dirname, 'src', 'app.ts'),
    output: {
        filename: path.join('.', 'app.js'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: ['node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                options: {
                    emitErrors: true,
                    failOnHint: true,
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new IgnorePlugin(/^pg-native$/),
        new HotModuleReplacementPlugin()
    ],
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [nodeExternals()]
};

module.exports = (_, argv) => {
    if (argv.mode === 'none') {
        // Add sourcemap for development
        config.devtool = 'source-map';

        // Run server
        const serverRunnerPlugin = new WebpackShellPluginNext(
            {
                onBuildEnd: {
                    scripts: ['npm run start:dev'],
                    blocking: false,
                    parallel: true
                }
            }
        );

        config.plugins.push(serverRunnerPlugin);
    }

    return config;
};
