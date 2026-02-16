import type { Story } from '@ladle/react'

import { Description } from './Description.js'

export default {
  title: 'Gherkin/Description',
}

type TemplateArgs = {
  description: string
}

const Template: Story<TemplateArgs> = ({ description }) => {
  return <Description description={description} />
}

export const Default = Template.bind({})
Default.args = {
  description: 'A single line description.',
}

export const Empty = Template.bind({})
Empty.args = {
  description: '',
}

export const Rich = Template.bind({})
Rich.args = {
  description: `A _rich_ multi-line description with **Markdown**.

### A heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim turpis eget lacinia luctus. Suspendisse blandit velit ut laoreet molestie. Phasellus tellus felis, venenatis ut nibh malesuada, vulputate cursus mi. Integer sollicitudin purus a diam tempus, sit amet iaculis felis cursus. Phasellus scelerisque, sem a convallis vulputate, quam diam commodo orci, sit amet vehicula ex lorem a risus. Quisque placerat porttitor sollicitudin. Aenean mollis elementum tortor. Morbi sit amet lacus vitae diam efficitur bibendum gravida vitae justo. In tempus diam eget mauris pellentesque venenatis. Quisque eleifend ullamcorper enim, sed posuere purus eleifend id. Quisque dapibus ultricies lectus et lacinia. Morbi felis est, placerat pharetra cursus quis, gravida bibendum dui. Aliquam a porta mauris. Vivamus venenatis efficitur est, at dapibus est blandit eu. In semper est vitae urna rhoncus, vel mattis magna aliquet.

Mauris eleifend luctus eleifend. Etiam mattis ac nibh ut dignissim. Pellentesque id accumsan nisi. Aliquam metus lectus, blandit sit amet nisi in, suscipit dictum augue. Nam leo sem, aliquam dignissim tellus vitae, condimentum faucibus dui. Nullam pellentesque ipsum quis purus euismod, rutrum volutpat nunc ultrices. Ut in pulvinar est, nec mattis urna. Integer ullamcorper nisl ut malesuada gravida. Vivamus ac odio vel ligula interdum rhoncus. Vestibulum sed tristique massa.

### Lists

- An
- unordered
- list

1. An
2. ordered
3. list  
`,
}
