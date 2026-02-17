import { defaultSchema } from 'hast-util-sanitize'
import type { Options } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import gfm from 'remark-gfm'

defaultSchema.tagNames?.push('mark', 'section', 'small')
defaultSchema.attributes?.['*'].push('className')

const plugins: Options['rehypePlugins'] = [gfm, rehypeRaw, [rehypeSanitize, defaultSchema]]
export default plugins
