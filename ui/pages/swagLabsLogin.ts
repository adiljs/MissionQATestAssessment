const selectors = {
  buttons: {
    login: '[data-test="login-button"]',
  },
  texts: {
    username: '[data-test="username"]',
    password: '[data-test="password"]',
  },
};

export class SwagLabsLoginPage {
  public async landingPage(): Promise<void> {
    await browser.url('https://www.saucedemo.com/');
  }

  public async setUsername(username: string): Promise<void> {
    await browser.$(selectors.texts.username).setValue(username);
  }

  public async setPassword(password: string): Promise<void> {
    await browser.$(selectors.texts.password).setValue(password);
  }

  public async getLogin(): Promise<void> {
    await browser.$(selectors.buttons.login).click();
  }
}
