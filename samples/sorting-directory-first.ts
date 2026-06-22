// Generated file. Do not edit.
import { type Envelope, SourceMediaType } from '@cucumber/messages'

type FeatureSpec = {
  uri: string
  featureName: string
  ids: {
    scenario: string
    pickle: string
    testCase: string
    testCaseStarted: string
  }
  nanos: number
}

function createFeatureEnvelopes({ uri, featureName, ids, nanos }: FeatureSpec): Envelope[] {
  return [
    {
      source: {
        uri,
        data: `Feature: ${featureName}\n\n  Scenario: A\n`,
        mediaType: SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN,
      },
    },
    {
      gherkinDocument: {
        feature: {
          tags: [],
          location: { line: 1, column: 1 },
          language: 'en',
          keyword: 'Feature',
          name: featureName,
          description: '',
          children: [
            {
              scenario: {
                id: ids.scenario,
                tags: [],
                location: { line: 3, column: 3 },
                keyword: 'Scenario',
                name: 'A',
                description: '',
                steps: [],
                examples: [],
              },
            },
          ],
        },
        comments: [],
        uri,
      },
    },
    {
      pickle: {
        id: ids.pickle,
        uri,
        location: { line: 3, column: 3 },
        astNodeIds: [ids.scenario],
        tags: [],
        name: 'A',
        language: 'en',
        steps: [],
      },
    },
    {
      testCase: {
        id: ids.testCase,
        pickleId: ids.pickle,
        testSteps: [],
        testRunStartedId: '0',
      },
    },
    {
      testCaseStarted: {
        id: ids.testCaseStarted,
        testCaseId: ids.testCase,
        timestamp: { seconds: 0, nanos },
        attempt: 0,
      },
    },
    {
      testCaseFinished: {
        testCaseStartedId: ids.testCaseStarted,
        timestamp: { seconds: 0, nanos: nanos + 1000000 },
        willBeRetried: false,
      },
    },
  ]
}

const features: FeatureSpec[] = [
  {
    uri: 'Features/C/f8.feature',
    featureName: 'f8',
    ids: {
      scenario: '29',
      pickle: '30',
      testCase: '31',
      testCaseStarted: '32',
    },
    nanos: 15000000,
  },
  {
    uri: 'Features/C/f7.feature',
    featureName: 'f7',
    ids: {
      scenario: '25',
      pickle: '26',
      testCase: '27',
      testCaseStarted: '28',
    },
    nanos: 13000000,
  },
  {
    uri: 'Features/C/D/f6.feature',
    featureName: 'f6',
    ids: {
      scenario: '21',
      pickle: '22',
      testCase: '23',
      testCaseStarted: '24',
    },
    nanos: 11000000,
  },
  {
    uri: 'Features/C/D/f5.feature',
    featureName: 'f5',
    ids: {
      scenario: '17',
      pickle: '18',
      testCase: '19',
      testCaseStarted: '20',
    },
    nanos: 9000000,
  },
  {
    uri: 'Features/A/f4.feature',
    featureName: 'f4',
    ids: {
      scenario: '13',
      pickle: '14',
      testCase: '15',
      testCaseStarted: '16',
    },
    nanos: 7000000,
  },
  {
    uri: 'Features/A/f3.feature',
    featureName: 'f3',
    ids: {
      scenario: '9',
      pickle: '10',
      testCase: '11',
      testCaseStarted: '12',
    },
    nanos: 5000000,
  },
  {
    uri: 'Features/A/B/f1.feature',
    featureName: 'f1',
    ids: {
      scenario: '1',
      pickle: '2',
      testCase: '3',
      testCaseStarted: '4',
    },
    nanos: 1000000,
  },
  {
    uri: 'Features/A/B/f2.feature',
    featureName: 'f2',
    ids: {
      scenario: '5',
      pickle: '6',
      testCase: '7',
      testCaseStarted: '8',
    },
    nanos: 3000000,
  },
]

export default [
  {
    testRunStarted: {
      id: '0',
      timestamp: { seconds: 0, nanos: 0 },
    },
  },
  ...features.flatMap((feature) => createFeatureEnvelopes(feature)),
  {
    testRunFinished: {
      testRunStartedId: '0',
      timestamp: { seconds: 0, nanos: 17000000 },
      success: true,
    },
  },
] as ReadonlyArray<Envelope>
