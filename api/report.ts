// report.ts
import * as reporter from 'cucumber-html-reporter';

reporter.generate({
  theme: 'bootstrap',
  jsonFile: './reports/cucumber_report.json',
  output: './reports/cucumber_report.html',
  reportSuiteAsScenarios: true,
  launchReport: true,
});
