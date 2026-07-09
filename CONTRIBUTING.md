# Welcome 💖

Before anything else, thank you for taking some of your precious time to help this project move forward. ❤️

If you're new to open source and feeling a bit nervous 😳, we understand! We recommend watching [this excellent guide](https://egghead.io/talks/git-how-to-make-your-first-open-source-contribution) to give you a grounding in some of the basic concepts. We want you to feel safe to make mistakes, and ask questions.

If anything in this guide or anywhere else in the codebase doesn't make sense to you, please let us know! It's through your feedback that we can make this codebase more welcoming, so we'll be glad to hear thoughts.

You can chat with us in the `#committers` channel in our [Community Discord](https://cucumber.io/community#discord), or feel free to [raise an issue](../../issues/new?assignees=&labels=%3Abank%3A+debt&template=developer_experience.md&title=) if you're experiencing any friction trying make your contribution.

## Getting started

First, install the dependencies and check the tests pass:

```shell
npm install
npm test
```

We use [Ladle](https://ladle.dev/) to develop and test our components, which you can start up with:

```shell
npm run start
```

## Using samples

Like most other Cucumber reporting tools, this project uses the samples shipped by the [Cucumber Compatibility Kit (CCK)](https://github.com/cucumber/compatibility-kit) as fixtures. The samples are pretty diverse and cover a lot of Cucumber functionality, and it'll usually be more convenient to re-use one than hand-craft a message stream.

On every `npm install`, the samples from the CCK are used to generate importable TypeScript files in the `acceptance` directory. You can use these directly in tests and stories - you'll find that most of our existing tests and stories already do.

If you need a sample for a use case that isn't covered by the CCK, you can add a custom sample:

1. Use the Cucumber of your choice to do a test run that captures the use case
2. Use the `message` formatter and direct the output to an `.ndjson` file
3. Add the `.ndjson` file to the `samples` directory in this repo
4. Run `npm run prepare` to regenerate the TypeScript files

(Please ensure your sample doesn't contain any secrets, proprietary or sensitive information before you commit it!)