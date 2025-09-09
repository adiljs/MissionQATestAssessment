const selectors = {
  texts: {
    firstName: '[data-test="firstName"]',
    lastName: '[data-test="lastName"]',
    postalCode: '[data-test="postalCode"]',
  },
  buttons: {
    continue: '[data-test="continue"]',
  },
};

export class SwagLabsCheckoutStepOnePage {
  public async setFirstName(firstName: string): Promise<void> {
    await browser.$(selectors.texts.firstName).setValue(firstName);
  }

  public async setLastName(lastName: string): Promise<void> {
    await browser.$(selectors.texts.lastName).setValue(lastName);
  }

  public async setPostalCode(postalCode: string): Promise<void> {
    await browser.$(selectors.texts.postalCode).setValue(postalCode);
  }

  public async getContinue(): Promise<void> {
    await browser.$(selectors.buttons.continue).click();
  }
}
