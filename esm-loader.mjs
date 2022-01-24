
import * as tsNodeEsm from 'ts-node/esm'
import { pathToFileURL, URL } from 'url'

export const { load, transformSource, resolve } = tsNodeEsm

const baseURL = pathToFileURL(`${process.cwd()}/`).href;

// css styles or html files
const extensionsRegex = /\.scss$/;

// export function resolve(specifier, context, defaultResolve) {
//   const { parentURL = baseURL } = context;

//   // Node.js normally errors on unknown file extensions, so return a URL for
//   // specifiers ending in the specified file extensions.
//   if (extensionsRegex.test(specifier)) {
//     console.log(specifier)
//     return {
//       url: new URL(specifier, parentURL).href,
//     };
//   }
//   console.log(' ', specifier)
//   // Let Node.js handle all other specifiers.
//   return tsNodeEsm.resolve(specifier, context, defaultResolve);
// }

export function getFormat(url, context, defaultGetFormat) {
  // Now that we patched resolve to let new file types through, we need to
  // tell Node.js what format such URLs should be interpreted as.
  if (extensionsRegex.test(url)) {
    return {
      format: 'module',
    };
  }
  // Let Node.js handle all other URLs.
  return tsNodeEsm.getFormat(url, context, defaultGetFormat);
}
