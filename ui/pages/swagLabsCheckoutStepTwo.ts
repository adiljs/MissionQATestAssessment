const selectors = {
  texts: {
    price: '[data-test="inventory-item-price"]',
    itemTotal: '[data-test="subtotal-label"]',
    tax: '[data-test="tax-label"]',
    total: '[data-test="total-label"]',
  },
};

export class SwagLabsCheckoutStepTwoPage {
  public async getItemPrice(index: number): Promise<string> {
    return await browser.$$(selectors.texts.price)[index].getText();
  }

  public async getItemTotal(): Promise<string> {
    return await browser.$(selectors.texts.itemTotal).getText();
  }

  public async getTax(): Promise<string> {
    return await browser.$(selectors.texts.tax).getText();
  }

  public async getTotal(): Promise<string> {
    return await browser.$(selectors.texts.total).getText();
  }
}
