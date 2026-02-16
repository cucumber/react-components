import { render } from '@testing-library/react'
import { expect } from 'chai'

import { HighLight } from './HighLight.js'
import { InMemorySearchProvider } from './InMemorySearchProvider.js'

describe('HighLight', () => {
  function renderHighlight(text: string, query: string, markdown: boolean) {
    return render(
      <InMemorySearchProvider defaultQuery={query}>
        <HighLight text={text} markdown={markdown} />
      </InMemorySearchProvider>
    )
  }

  it('puts <mark> around exact matches', () => {
    const { container } = renderHighlight('Some text with a keyword inside', 'keyword', false)
    const highlighted = Array.from(container.querySelectorAll('mark')).map(
      (span) => span.textContent
    )

    expect(highlighted).to.deep.eq(['keyword'])
  })

  it('puts <mark> around stemmed query words', () => {
    const { container } = renderHighlight(
      'This step has failed when a failure occurred (so it fails)',
      'failed',
      false
    )
    const highlighted = Array.from(container.querySelectorAll('mark')).map(
      (span) => span.textContent
    )

    // The first one is the exact match.
    // The second one corresponds to the "failure" word, which stem is "fail"
    // The third one corresponds to the "fails" word
    expect(highlighted).to.deep.eq(['failed', 'fail', 'fail'])
  })

  it('puts <mark> around multiple words and stems', () => {
    const { container } = renderHighlight(
      'Given a passed step\nWhen a failed step\nThen a skipped step',
      'step fail pass skipped',
      false
    )
    const highlighted = Array.from(container.querySelectorAll('mark')).map(
      (span) => span.textContent
    )

    expect(highlighted).to.deep.eq(['pass', 'step', 'fail', 'step', 'skipped', 'step'])
  })

  it('puts <mark> around matches in markdown', () => {
    const { container } = renderHighlight('* This is\n* a bullet list', 'bullet', true)
    const highlighted = Array.from(container.querySelectorAll('mark')).map(
      (span) => span.textContent
    )

    expect(highlighted).to.deep.eq(['bullet'])
  })

  it('does not render <script> tags in markdown', () => {
    const { container } = renderHighlight('Failed XSS: <script>alert("hello")</script>', '', true)
    // Script tags will be removed (rather than escaped). Ideally we'd *escape* them to &lt;script&gt;.
    expect(container).to.contain.html(`<div class="highlight"><p>Failed XSS: </p></div>`)
  })

  it('renders <section> tags in markdown', () => {
    const { container } = renderHighlight(
      'We *like* other HTML tags:\n\n<section>hello</section>',
      '',
      true
    )
    expect(container).to.contain.html(
      `<div class="highlight"><p>We <em>like</em> other HTML tags:</p>\n<section>hello</section></div>`
    )
  })

  it('does not render JavaScript event handlers on tags in markdown', () => {
    const { container } = renderHighlight(
      `Failed XSS: <small onclick="alert('hello')" class="supersmall">hello</small>`,
      '',
      true
    )
    expect(container).to.contain.html(
      '<div class="highlight"><p>Failed XSS: <small class="supersmall">hello</small></p></div>'
    )
  })

  it('renders links with appropriate target and rel attrs', () => {
    const { container } = renderHighlight('[Example](https://example.com)', '', true)
    const link = container.querySelector('a')
    expect(link).to.have.attr('href', 'https://example.com')
    expect(link).to.have.attr('target', '_blank')
    expect(link).to.have.attr('rel', 'noopener nofollow noreferrer')
    expect(link).to.have.text('Example')
  })
})
