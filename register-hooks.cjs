const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

require('global-jsdom/register')

register('ts-node/esm', pathToFileURL(__filename));
register('esm-loader-css', pathToFileURL(__filename));
