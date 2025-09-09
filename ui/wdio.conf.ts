import type { Options } from '@wdio/types';

const _config = {
  // keep a single worker while debugging
  maxInstances: 1,

  framework: 'cucumber',
  specs: ['./features/**/*.feature'],

  // make TS run in-memory with proper maps
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      files: true,
      project: './tsconfig.json',
    },
  },

  // this is the key bit: start each WDIO worker with the debugger + source maps
  execArgv: ['--inspect=0', '--enable-source-maps'],

  cucumberOpts: {
    // ensure your step files are required
    require: ['./step-definitions/**/*.ts'],
    format: ['json:./reports/cucumber_report.json'],
    // rely on autoCompileOpts/ts-node, don't double-register ts-node
    failAmbiguousDefinitions: true,
    ignoreUndefinedDefinitions: false,
    timeout: 60000,
  },

  // keep existing items (services, reporters, capabilities)
  services: [],
  reporters: [
    'spec',
    [
      'cucumberjs-json',
      {
        jsonFolder: './reports/cucumber-json/', // Output directory for JSON files
        language: 'en',
      },
    ],
  ],
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--disable-gpu'],
      },
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
};

export const config = _config as Options.Testrunner;
