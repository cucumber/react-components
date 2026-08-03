import { register } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { register as tsxRegister } from 'tsx/esm/api'
import 'global-jsdom/register'
import * as chai from 'chai'
import chaiDom from 'chai-dom'
import sinonChai from 'sinon-chai'

tsxRegister()
register('./css-loader.mjs', pathToFileURL(fileURLToPath(import.meta.url)))

chai.use(chaiDom).use(sinonChai)
