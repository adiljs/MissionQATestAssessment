const selectors = {
  buttons: {
    sauceLabsBackpack: '[data-test="add-to-cart-sauce-labs-backpack"]',
    sauceLabsFleeceJacket: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
    sauceLabsBoltTShirt: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
    sauceLabsOnesie: '[data-test="add-to-cart-sauce-labs-onesie"]',
  },
  labels: {
    shoppingCartBadge: '[data-test="shopping-cart-badge"]',
  },
  links: {
    shoppingCart: '[data-test="shopping-cart-link"]',
  },
};

export class SwagLabsInventoryPage {
  public async getAddSauceLabsBackpackToCart(): Promise<void> {
    await browser.$(selectors.buttons.sauceLabsBackpack).click();
  }

  public async getAddSauceLabsFleeceJacketToCart(): Promise<void> {
    await browser.$(selectors.buttons.sauceLabsFleeceJacket).click();
  }

  public async getAddSauceLabsBoltTShirtToCart(): Promise<void> {
    await browser.$(selectors.buttons.sauceLabsBoltTShirt).click();
  }

  public async getAddSauceLabsOnesieToCart(): Promise<void> {
    await browser.$(selectors.buttons.sauceLabsOnesie).click();
  }

  public async getShoppingCartBadge(): Promise<string> {
    return await browser.$(selectors.labels.shoppingCartBadge).getText();
  }

  public async getShoppingCartLink(): Promise<void> {
    await browser.$(selectors.links.shoppingCart).click();
  }
}
