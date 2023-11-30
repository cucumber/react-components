const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('ts-node/esm', pathToFileURL(__filename))
register('esm-loader-css', pathToFileURL(__filename))

require('global-jsdom/register')
require('chai').use(require('chai-dom'))
