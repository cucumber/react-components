import { register } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'
import 'global-jsdom/register'
import * as chai from 'chai'
import chaiDom from 'chai-dom'
import sinonChai from 'sinon-chai'

register('ts-node/esm', pathToFileURL(fileURLToPath(import.meta.url)))
register('./css-loader.mjs', pathToFileURL(fileURLToPath(import.meta.url)))

chai.use(chaiDom).use(sinonChai)