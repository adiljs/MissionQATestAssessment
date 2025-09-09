const selectors = {
  buttons: {
    removeSauceLabsFleeceJacket: '[data-test="remove-sauce-labs-fleece-jacket"]',
    checkout: '[data-test="checkout"]',
  },
  labels: {
    itemQuantity: '[data-test="item-quantity"]',
  },
};

export class SwagLabsCartPage {
  public async getItemQuantity(index: number): Promise<string> {
    const itemQuantities = await browser.$$(selectors.labels.itemQuantity)[index].getText();
    return itemQuantities;
  }

  public async removeSauceLabsFleeceJacketFromCart(): Promise<void> {
    await browser.$(selectors.buttons.removeSauceLabsFleeceJacket).click();
  }

  public async getCheckout(): Promise<void> {
    await browser.$(selectors.buttons.checkout).click();
  }
}
