declare module 'multiple-cucumber-html-reporter' {
  type Options = {
    jsonDir: string;
    reportPath: string;
    [key: string]: unknown;
  };

  const reporter: { generate: (opts: Options) => void };
  export default reporter;
}
