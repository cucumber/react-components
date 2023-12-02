const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('ts-node/esm', pathToFileURL(__filename))
register('./css-loader.mjs', pathToFileURL(__filename))

require('global-jsdom/register')
require('chai').use(require('chai-dom')).use(require('sinon-chai'))
