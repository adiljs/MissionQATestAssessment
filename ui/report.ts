// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { generate } from 'multiple-cucumber-html-reporter';

// Generate HTML report from all JSON files in the cucumber-json folder
generate({
  jsonDir: './reports/cucumber-json/', // Path to your JSON files
  reportPath: './reports/cucumber-html/', // Output directory for HTML report
  reportName: 'UI Test Report',
  pageTitle: 'UI Test Report',
  displayDuration: true,
  openReportInBrowser: true,
});
