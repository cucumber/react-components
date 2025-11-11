# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Include duration for each test step ([#396](https://github.com/cucumber/react-components/pull/396))
- Include pass rate in execution summary ([#397](https://github.com/cucumber/react-components/pull/397))
- Add new `<Report/>` component ([#410](https://github.com/cucumber/react-components/pull/410)) ([#411](https://github.com/cucumber/react-components/pull/411))
- Add new `<TestRunHooks/>` component and include in report ([#408](https://github.com/cucumber/react-components/pull/408))

### Changed
- Render a more test case-centric report ([#396](https://github.com/cucumber/react-components/pull/396))

### Fixed
- Use uuid library instead of web crypto API ([#402](https://github.com/cucumber/react-components/pull/402))
- Text with numbers is no longer right aligned ([#405](https://github.com/cucumber/react-components/pull/405))

### Removed
- BREAKING CHANGE: Remove defunct scenario/step components `<ExamplesTable/>`, `<GherkinStep/>`, `<GherkinSteps/>`, `<HookStep/>`, `<HookSteps/>`, `<StepItem/>` and their corresponding `CustomRenderingSupport` properties ([#396](https://github.com/cucumber/react-components/pull/396))
- BREAKING CHANGE: Remove defunct `<NoMatchResult/>` component ([#411](https://github.com/cucumber/react-components/pull/411))
- BREAKING CHANGE: Remove defunct `<UriProvider/>` component and underlying context ([#396](https://github.com/cucumber/react-components/pull/396))
- BREAKING CHANGE: Remove `<MDG/>` component in favour of using standard Gherkin components for Markdown documents ([#396](https://github.com/cucumber/react-components/pull/396))
- BREAKING CHANGE: Remove public export of `filterByStatus` ([#412](https://github.com/cucumber/react-components/pull/412))

## [23.2.0] - 2025-08-07
### Changed
- Applied URI-based sorting for the displayed Gherkin documents ([#394](https://github.com/cucumber/react-components/pull/394))

## [23.1.1] - 2025-06-24
### Added
- Add [data-testid] to items in the execution summary ([#391](https://github.com/cucumber/react-components/pull/391))

## [23.1.0] - 2025-06-15
### Changed
- Update colors for consistency with other Cucumber web stuff ([#390](https://github.com/cucumber/react-components/pull/390))

## [23.0.0] - 2025-05-25
### Added
- Add `<CustomRendering/>` to override presentation ([#382](https://github.com/cucumber/react-components/pull/382))
- Add `<ControlledSearchProvider/>`, `<InMemorySearchProvider/>` and `<UrlSearchProvider/>` to provide search state ([#384](https://github.com/cucumber/react-components/pull/384))
- Add `<UriProvider/>`, to provide document URI state ([#386](https://github.com/cucumber/react-components/pull/386))
- Add `<FilteredDocuments/>`, to provide (optionally filtered) documents with no props ([#388](https://github.com/cucumber/react-components/pull/388))

### Changed
- Inherit font-size instead of setting at 14px ([#377](https://github.com/cucumber/react-components/pull/377))
- Redesigned report header block ([#381](https://github.com/cucumber/react-components/pull/381))
- BREAKING CHANGE: Remove props from `<StatusesSummary/>`, `<ExecutionSummary/>` and `<SearchBar/>` components, use contexts for state ([#374](https://github.com/cucumber/react-components/pull/374))
- BREAKING CHANGE: Components and hooks are now exported at the top level, not within `components` and `hooks` objects ([#383](https://github.com/cucumber/react-components/pull/383))
- BREAKING CHANGE: `<EnvelopesWrapper/>` and `<QueriesWrapper/>` renamed to `<EnvelopesProvider/>` and `<QueriesProvider/>` for clarity ([#385](https://github.com/cucumber/react-components/pull/385))

### Fixed
- Make keyword spacing look right ([#376](https://github.com/cucumber/react-components/pull/376))
- Fix issue with hook steps not being rendered ([#379](https://github.com/cucumber/react-components/pull/379))
- Rounding down of percent passed and adding one decimal place ([#380](https://github.com/cucumber/react-components/pull/380))
- Avoid UUID errors from accordion when document URI contains spaces ([#386](https://github.com/cucumber/react-components/pull/386))

### Removed
- BREAKING CHANGE: Remove `EnvelopesQuery` and its React context ([#374](https://github.com/cucumber/react-components/pull/374))
- BREAKING CHANGE: Remove defunct `<CucumberReact/>` component ([#382](https://github.com/cucumber/react-components/pull/382))
- BREAKING CHANGE: Remove `SearchQueryContext`, `<SearchWrapper/>` and related defunct symbols ([#384](https://github.com/cucumber/react-components/pull/384))
- BREAKING CHANGE: Remove `GherkinQueryContext` and `CucumberQueryContext` from entry point ([#385](https://github.com/cucumber/react-components/pull/385))
- BREAKING CHANGE: Remove `<FilteredResults/>` component in favour of composition ([#388](https://github.com/cucumber/react-components/pull/388))

## [22.4.1] - 2025-03-30
### Fixed
- Remove duplications in steps due to empty parameters ([#373](https://github.com/cucumber/react-components/pull/373))

## [22.4.0] - 2025-03-26
### Added
- Add CSS custom properties for overriding fonts ([#372](https://github.com/cucumber/react-components/pull/372))

### Fixed
- Avoid NaN percentage passed when nothing ran ([#363](https://github.com/cucumber/react-components/pull/363))
- Don't render hook steps with no content ([#361](https://github.com/cucumber/react-components/pull/361))

## [22.3.0] - 2024-08-02
### Added
- Support text/uri-list attachments ([#355](https://github.com/cucumber/react-components/pull/355))

## [22.2.0] - 2024-06-21
### Added
- Support for externalised attachments ([#353](https://github.com/cucumber/react-components/pull/353))

## [22.1.0] - 2024-03-15
### Added
- Support `TestStepResult.exception` in results ([#345](https://github.com/cucumber/react-components/pull/345))

## [22.0.0] - 2023-12-09
### Changed
- BREAKING CHANGE: Switch to ESM ([#338](https://github.com/cucumber/react-components/pull/338))
- Switch search implementation to Orama ([#337](https://github.com/cucumber/react-components/pull/337))
- Apply search query on change ([#337](https://github.com/cucumber/react-components/pull/337))

## [21.1.1] - 2023-07-13
### Fixed
- Switch out `mime-types` for `mime` ([#334](https://github.com/cucumber/react-components/pull/334))

## [21.1.0] - 2023-07-13
### Added
- Add ability to download unsupported attachments ([#333](https://github.com/cucumber/react-components/pull/333))

## [21.0.1] - 2022-11-26
### Fixed
- Fix missing stylesheets in npm package

## [21.0.0] - 2022-11-25
### Changed
- BREAKING CHANGE: React 18+ is now required ([#279](https://github.com/cucumber/react-components/pull/279))

### Fixed
- Omit filtered-out pickles from rendered documents ([#321](https://github.com/cucumber/react-components/pull/321))

## [20.2.0] - 2022-09-13
### Changed
- Single line breaks in descriptions are rendered less surprisingly ([#227](https://github.com/cucumber/react-components/pull/227))

### Fixed
- Omit filtered-out pickles from counts, filters ([#273](https://github.com/cucumber/react-components/pull/273))

## [20.1.0] - 2022-05-27
### Changed
- Allow showing detail of every example, simplify examples table ([#159](https://github.com/cucumber/react-components/pull/159))

## [20.0.2] - 2022-04-14
### Fixed
- Downgrade `@fortawesome` packages which seemed to cause issues with html-formatter

## [20.0.1] - 2022-04-14
### Fixed
- Downgrade `@fortawesome` packages which seemed to cause issues with html-formatter

## [20.0.0] - 2022-04-12
### Added
- Render hook names if present ([#137](https://github.com/cucumber/cucumber-react/pull/137))

### Changed
- Scenario outline styling - Examples changed to H3 and aligned with steps
- Package name is now `@cucumber/react-components` for clarity

## [19.2.0] - 2022-03-25
### Added
- Attachment names are now displayed as the title of attachment sections in the report
- Where an attachment name is not provided then the media type is included in the default name of the attachment

### Changed
- Text attachments in the html report are now displayed as collapsible sections

## [19.1.1] - 2022-03-22
### Fixed
- Fix build issue where styles were not included in package.

## [19.1.0] - 2022-03-22
### Changed
- Most content is now rendered with a sans serif font.

## [19.0.0] - 2022-01-24
### Added
- Add `<EnvelopesWrapper/>` component to succinctly populate query contexts from an array of messages.
- Add 'auto' theme, honouring platform light/dark preference.
- Add `useQueries` and `useSearch` hooks to avoid accessing many contexts directly.

### Changed
- New `<CucumberReact/>` component is used as root component in consuming projects, replacing. `<CustomRendering/>`.
- New visual designs for report-related components.
- Move search-related props from `<QueriesWrapper/>` to new `<SearchWrapper/>` component.

### Fixed
- Import correct stylesheet in the Children component. This also allows to override it using `CustomRendering`.
- Display step list items correctly (i.e. without bullets) in Backgrounds and in MDX documents.

### Removed
- Remove global stylesheet, all styles are now encapsulated in appropriate components.

## [18.1.2] - 2021-09-08
### Fixed
- The 8.1.1 release was accidentally released without compiling the TypeScript code

## [18.1.1] - 2021-09-08
### Fixed
- The 8.1.0 release was accidentally released without compiling the TypeScript code

## [18.1.0] - 2021-09-08
### Added
- Make `<GherkinDocument>` customiseable.

## 18.0.0 - 2021-09-02
### Changed
- The React components are exported via the `components` property.
([#1660](https://github.com/cucumber/common/pull/1660)
[aslakhellesoy](https://github.com/aslakhellesoy))
- Upgrade to `@cucumber/gherkin-utils` `^7.0.0`
- Upgrade to `@cucumber/messages` `^17.1.0`
- Upgrade to `@cucumber/query` `^11.0.0`
- Upgrade to `@cucumber/tag-expressions` `4.0.0`

## [17.0.0] - 2021-07-08
### Changed
- Upgrade dependencies including `@cucumber/messages` to 17.0.0, `@cucumber/query` to 11.0.0 and `@cucumber/gherkin-utils` to 6.O.0

### Fixed
- Render attachments in Examples Tables.
([#1173](https://github.com/cucumber/common/issues/1173)
[#1619](https://github.com/cucumber/common/pull/1619)
[aslakhellesoy](https://github.com/aslakhellesoy))
- Handle missing hook message when rendering hook failure
- Stop the anchor link for the step from overlapping the status icon

## [16.2.0] - 2021-06-02
### Added
- Export the `<GherkinDocument>` React component.

## [16.1.0] - 2021-05-27
### Added
- Add `preExpand` property to `<GherkinDocumentList>`, controlling whether or not
non-PASSED feature files are expanded or not.

### Fixed

## [16.0.2] - 2021-05-27
### Fixed
- Don't use `GherkinDocument#uri` as the `uuid` property in `<AccordionItem>` since it cannot
be assumed to be a valid `uuid`. Rely on the autogenerated UUID instead.
- Remove a `console.log` debug statement in the code.

## [16.0.1] - 2021-05-27
### Fixed
- Fixed a bug in `Step.tsx` that threw an error when a `Group#value` had value `undefined`

## [16.0.0] - 2021-05-26
### Added
- New `<MDG>` component for rendering [Markdown with Gherkin](../gherkin/MARKDOWN_WITH_GHERKIN.md) documents.
- Experimental support for theming and custom rendering ([1391](https://github.com/cucumber/common/pull/1391))

### Changed
- Various look and feel changes ([1391](https://github.com/cucumber/common/pull/1391))

## [14.0.0] - 2021-05-17
### Added
- [JavaScript] Export `StatusIcon` component.
([#1478](https://github.com/cucumber/cucumber/pull/1478)
[@vincent-psarga])

### Changed
- Upgrade to messages 16.0.0

## 13.0.0 - 2021-04-06
### Changed
- Upgrade dependencies including `@cucumber/gherkin` ^18.0.0,
`@cucumber/messages` ^15.0.0 and `@cucumber/query` ^9.0.2

## [12.0.0] - 2021-02-07
### Changed
- Upgrade to gherkin 17.0.0
- Upgrade to messages 14.0.0
- Upgrade to query 8.0.0

### Fixed
- [JavaScript] removed circular dependencies.
([#1292](https://github.com/cucumber/cucumber/pull/1292)
[davidjgoss](https://github.com/aslakhellesoy))
- Fixed search button
([#1298](https://github.com/cucumber/cucumber/issues/1298)
[#1299](https://github.com/cucumber/cucumber/issues/1299)
[hWorblehat](https://github.com/hWorblehat))
- Fixed inability to scroll horizontally in long text attachments

## [11.0.2] - 2020-12-17
### Fixed
- Upgraded `@cucumber/query` (only change is the dropped dependency on `@cucumber/gherkin`)

## [11.0.1] - 2020-12-17
### Fixed
- Fixed `react` and `react-dom` peerDependencies version range from `^16 | ^17` (incorrect) to `~16 || ~17`

## [11.0.0] - 2020-12-17
### Fixed
- Make image and video attachments collapsible; show collapsed by default.
- Prevent images from growing wider than their container.
([#1220](https://github.com/cucumber/cucumber/issues/1220)
[#1205](https://github.com/cucumber/cucumber/issues/1205)
[#1260](https://github.com/cucumber/cucumber/pull/1260)
[davidjgoss](https://github.com/davidjgoss))
- Markdown rendering of `description` fields are now done with `react-markdown` instead of `marked`.
This is a more secure [protection agains XSS](https://medium.com/javascript-security/avoiding-xss-via-markdown-in-react-91665479900)
([#1275](https://github.com/cucumber/cucumber/issues/1275)
[#1276](https://github.com/cucumber/cucumber/pull/1276)
[aslakhellesoy](https://github.com/aslakhellesoy))

## [10.1.2] - 2020-12-13
### Fixed
- Allow `react` and `react-dom` peer dependencies to be `^16 | ^17`.

## [10.1.1] - 2020-11-06
### Fixed
- Replaced `git-url-parse` with our own simpler implementation that doesn't need a browser polyfill.

## [10.1.0] - 2020-11-04
### Added
- Upgrade to React 17
- Upgrade to `@cucumber/gherkin-utils 2.1.0`
- Upgrade to `@cucumber/messages 13.1.0`
- Upgrade to `@cucumber/tag-expressions 3.0.0`
- Upgrade to Storybook 6.0.0

### Fixed
- Fixed typos in some CSS class names

## [10.0.1] - 2020-09-02
### Fixed
- Fix rendering of failed hooks from Cucumber-JVM
([#1166](https://github.com/cucumber/cucumber/issues/1166)
[#1167](https://github.com/cucumber/cucumber/pull/1167)
[@aslakhellesoy]
[@sebrose]
[@cbliard])
- Fix react warnings about rendering `<li>` inside `<li>`
- Updated some class names

## [10.0.0] - 2020-08-08
### Added
- Export all the `*Context` classes

### Changed
- Update `messages` to 13.0.1

### Fixed
- Added missing CSS class on BackgroundTitle anchor link.

## [9.0.0] - 2020-08-07
### Added
- semantic CSS classes on elements.
- expose `filterByStatus` method

### Changed
- fix `filterByStatus` signature

## 8.2.0 - 2020-07-31
### Changed
- Updated `messages` to v12.4.0

## [8.1.0] - 2020-07-30
### Added
- Display visible anchors for headers ([#983](https://github.com/cucumber/cucumber/issues/983))
- Make Duration human readable.

### Fixed
- better styling
- enhanced responsivness
- filtering is now alongside search
- do not display filter when all scenarios have the same status (except if status is "unknown")
- Various fixes ([#1111](https://github.com/cucumber/cucumber/pull/1111))

## 8.0.2 - 2020-06-29
### Added
- Expose `<FilteredResults>` in exports so we don't need to reach into `dist`

## [8.0.1] - 2020-06-29
### Fixed
- Make `ansi-to-html` a runtime dependency

## [8.0.0] - 2020-06-29
### Added
- Display execution summary ([#1067](https://github.com/cucumber/cucumber/pull/1067))
- Display failed Hooks and attachments added in Hooks ([#975](https://github.com/cucumber/cucumber/pull/975))
- Use ANSI color to render logs ([#1057](https://github.com/cucumber/cucumber/issues/1057))
- Add search ([#895](https://github.com/cucumber/cucumber/pull/895))

### Changed
- Do not rely on line number to obtain Step or Row status.
- Upgrade internal dependencies

## [7.0.0] - 2020-04-14
### Added
- `image/*`
- Only base64 content encoding supported
- `video/*`
- Only base64 content encoding supported
- `text/*`
- Both base64 and identity content encoding supported
- `application/json`
- Both base64 and identity content encoding supported
- JSON is prettified with 2 space indent
([#964](https://github.com/cucumber/cucumber/pull/964)
[#945](https://github.com/cucumber/cucumber/issues/945)
[aslakhellesoy](https://github.com/aslakhellesoy))
- The `<Attachment>` component can now display the following media types:

### Changed
- Upgrade to messages 12.0.0
- Upgrade to gherkin 13.0.0

## [6.0.0] - 2020-04-01
### Changed
- Upgrade to messages 11.x
- Image attachment data processing is possibly faster since no `btoa` conversion is needed anymore

### Removed
- Removed `btoa` prop from `<QueriesWrapper>`
- Removed `<Wrapper>`

## [5.1.0] - 2020-03-04
### Added
- Add `<QueriesWrapper>` which allows incrementally updating queries without having
to rebuild them every time the envelope list is updated. Use this instead of `<Wrapper>`

### Deprecated
- The `<Wrapper>` component is deprecated in favour of `<QueriesWrapper>`.

### Fixed
- Fix a bug in rendering of steps before test cases have been received

## [5.0.0] - 2020-03-02
### Added
- Render Markdown in descriptions
([#909](https://github.com/cucumber/cucumber/pull/909)
[#codemrkay])

### Changed
- Upgrade messages and query

## [4.1.1] - 2020-02-28
### Fixed
- Fix broken 4.1.0 release

## 4.1.0 - 2020-02-28
### Added
- Add compiled stylesheets to package

## [4.0.0] - 2020-02-14
### Added
- Display attachments (`image/*` and `text/*` media types)

### Changed
- Upgraded messages and query

## [3.3.0] - 2020-01-22
### Fixed
- Accordion now displays the aggregated status colour
- Render Examples rows properly
([#778](https://github.com/cucumber/cucumber/issues/778)
[aslakhellesoy](https://github.com/aslakhellesoy))
- Do not highlight placeholders
([#826](https://github.com/cucumber/cucumber/issues/826)
[aslakhellesoy](https://github.com/aslakhellesoy))

## 3.2.0 - 2020-01-10
### Changed
- [JavaScript] changed module name to `@cucumber/react`
- Replace styled-components with external CSS
([#839](https://github.com/cucumber/cucumber/pull/839)
[aslakhellesoy](https://github.com/aslakhellesoy))

## 3.1.0 - 2019-12-10
### Changed
- Render errors in `<pre>`
- Upgrade to cucumber-messages 8.0.0

## 3.0.0 - 2019-11-15
### Changed
- Only display accordion
- Upgrade to cucumber-messages 7.0.0
- Extract lookup logic to cucumber-query 1.0.0

### Removed
- Removed the side nav

## 2.0.1 - 2019-10-18
### Changed
- Upgrade to cucumber-messages 6.0.2

## 2.0.0 - 2019-10-10

## 1.1.0 - 2019-08-29
### Fixed
- Better layout and styling
- Better results aggregation
- Better support for empty/malformed Gherkin documents

## 1.0.0 - 2019-08-23
### Added
- First release

[Unreleased]: https://github.com/cucumber/cucumber-react/compare/v23.2.0...HEAD
[23.2.0]: https://github.com/cucumber/cucumber-react/compare/v23.1.1...v23.2.0
[23.1.1]: https://github.com/cucumber/cucumber-react/compare/v23.1.0...v23.1.1
[23.1.0]: https://github.com/cucumber/cucumber-react/compare/v23.0.0...v23.1.0
[23.0.0]: https://github.com/cucumber/cucumber-react/compare/v22.4.1...v23.0.0
[22.4.1]: https://github.com/cucumber/cucumber-react/compare/v22.4.0...v22.4.1
[22.4.0]: https://github.com/cucumber/cucumber-react/compare/v22.3.0...v22.4.0
[22.3.0]: https://github.com/cucumber/cucumber-react/compare/v22.2.0...v22.3.0
[22.2.0]: https://github.com/cucumber/cucumber-react/compare/v22.1.0...v22.2.0
[22.1.0]: https://github.com/cucumber/cucumber-react/compare/v22.0.0...v22.1.0
[22.0.0]: https://github.com/cucumber/cucumber-react/compare/v21.1.1...v22.0.0
[21.1.1]: https://github.com/cucumber/cucumber-react/compare/v21.1.0...v21.1.1
[21.1.0]: https://github.com/cucumber/cucumber-react/compare/v21.0.1...v21.1.0
[21.0.1]: https://github.com/cucumber/cucumber-react/compare/v21.0.0...v21.0.1
[21.0.0]: https://github.com/cucumber/cucumber-react/compare/v20.2.0...v21.0.0
[20.2.0]: https://github.com/cucumber/cucumber-react/compare/v20.1.0...v20.2.0
[20.1.0]: https://github.com/cucumber/cucumber-react/compare/v20.0.2...v20.1.0
[20.0.2]: https://github.com/cucumber/cucumber-react/compare/v20.0.1...v20.0.2
[20.0.1]: https://github.com/cucumber/cucumber-react/compare/v20.0.0...v20.0.1
[20.0.0]: https://github.com/cucumber/cucumber-react/compare/v19.2.0...v20.0.0
[19.2.0]: https://github.com/cucumber/cucumber-react/compare/v19.1.1...v19.2.0
[19.1.1]: https://github.com/cucumber/cucumber-react/compare/v19.1.0...v19.1.1
[19.1.0]: https://github.com/cucumber/cucumber-react/compare/v19.0.0...v19.1.0
[19.0.0]: https://github.com/cucumber/cucumber-react/compare/v18.1.2...v19.0.0
[18.1.2]: https://github.com/cucumber/cucumber-react/compare/v18.1.1...v18.1.2
[18.1.1]: https://github.com/cucumber/cucumber-react/compare/v18.1.0...v18.1.1
[18.1.0]: https://github.com/cucumber/cucumber-react/compare/v17.0.0...v18.1.0
[17.0.0]: https://github.com/cucumber/cucumber-react/compare/v16.2.0...v17.0.0
[16.2.0]: https://github.com/cucumber/cucumber-react/compare/v16.1.0...v16.2.0
[16.1.0]: https://github.com/cucumber/cucumber-react/compare/v16.0.2...v16.1.0
[16.0.2]: https://github.com/cucumber/cucumber-react/compare/v16.0.1...v16.0.2
[16.0.1]: https://github.com/cucumber/cucumber-react/compare/v16.0.0...v16.0.1
[16.0.0]: https://github.com/cucumber/cucumber-react/compare/v14.0.0...v16.0.0
[14.0.0]: https://github.com/cucumber/cucumber-react/compare/v12.0.0...v14.0.0
[12.0.0]: https://github.com/cucumber/cucumber-react/compare/v11.0.2...v12.0.0
[11.0.2]: https://github.com/cucumber/cucumber-react/compare/v11.0.1...v11.0.2
[11.0.1]: https://github.com/cucumber/cucumber-react/compare/v11.0.0...v11.0.1
[11.0.0]: https://github.com/cucumber/cucumber-react/compare/v10.1.2...v11.0.0
[10.1.2]: https://github.com/cucumber/cucumber-react/compare/v10.1.1...v10.1.2
[10.1.1]: https://github.com/cucumber/cucumber-react/compare/v10.1.0...v10.1.1
[10.1.0]: https://github.com/cucumber/cucumber-react/compare/v10.0.1...v10.1.0
[10.0.1]: https://github.com/cucumber/cucumber-react/compare/v10.0.0...v10.0.1
[10.0.0]: https://github.com/cucumber/cucumber-react/compare/v9.0.0...v10.0.0
[9.0.0]: https://github.com/cucumber/cucumber-react/compare/v8.1.0...v9.0.0
[8.1.0]: https://github.com/cucumber/cucumber-react/compare/v8.0.1...v8.1.0
[8.0.1]: https://github.com/cucumber/cucumber-react/compare/v8.0.0...v8.0.1
[8.0.0]: https://github.com/cucumber/cucumber-react/compare/v7.0.0...v8.0.0
[7.0.0]: https://github.com/cucumber/cucumber-react/compare/v6.0.0...v7.0.0
[6.0.0]: https://github.com/cucumber/cucumber-react/compare/v5.1.0...v6.0.0
[5.1.0]: https://github.com/cucumber/cucumber-react/compare/v5.0.0...v5.1.0
[5.0.0]: https://github.com/cucumber/cucumber-react/compare/v4.1.1...v5.0.0
[4.1.1]: https://github.com/cucumber/cucumber-react/compare/v4.0.0...v4.1.1
[4.0.0]: https://github.com/cucumber/cucumber-react/compare/v3.3.0...v4.0.0
[3.3.0]: https://github.com/cucumber/cucumber-react/compare/v3.2.0...v3.3.0
