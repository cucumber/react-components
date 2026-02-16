import { Options } from 'react-markdown'
import remarkBreaks from 'remark-breaks'

const plugins: Options['remarkPlugins'] = [remarkBreaks]
export default plugins
