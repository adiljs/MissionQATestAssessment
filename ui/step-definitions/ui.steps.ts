import { Given, Then } from '@wdio/cucumber-framework';
import { DataTable } from '@cucumber/cucumber';
import { SwagLabsLoginPage } from '../pages/swagLabsLogin';
import { SwagLabsInventoryPage } from '../pages/swagLabsInventory';
import { SwagLabsCartPage } from '../pages/swagLabsCart';
import { SwagLabsCheckoutStepOnePage } from '../pages/swagLabsCheckoutStepOne';
import { SwagLabsCheckoutStepTwoPage } from '../pages/swagLabsCheckoutStepTwo';

const swagLabsLoginPage = new SwagLabsLoginPage();
const swagLabsInventoryPage = new SwagLabsInventoryPage();
const swagLabsCartPage = new SwagLabsCartPage();
const swagLabsCheckoutStepOnePage = new SwagLabsCheckoutStepOnePage();
const swagLabsCheckoutStepTwoPage = new SwagLabsCheckoutStepTwoPage();

let itemCount: string;

Given('I am on the home page', async function () {
  await swagLabsLoginPage.landingPage();
});

Given('I login in with the following details', async function (dataTable: DataTable) {
  type LoginRow = { userName: string; password: string };
  const rows = dataTable.hashes() as LoginRow[];
  for (const row of rows) {
    await swagLabsLoginPage.setUsername(row.userName);
    await swagLabsLoginPage.setPassword(row.password);
    await swagLabsLoginPage.getLogin();
  }
});

Given('I add the following items to the basket', async function (dataTable: DataTable) {
  const items: string[] = dataTable.raw().map((row: string[]) => row[0]);
  for (const item of items) {
    if (item === 'Sauce Labs Backpack') {
      await swagLabsInventoryPage.getAddSauceLabsBackpackToCart();
    } else if (item === 'Sauce Labs Fleece Jacket') {
      await swagLabsInventoryPage.getAddSauceLabsFleeceJacketToCart();
    } else if (item === 'Sauce Labs Bolt T-Shirt') {
      await swagLabsInventoryPage.getAddSauceLabsBoltTShirtToCart();
    } else if (item === 'Sauce Labs Onesie') {
      await swagLabsInventoryPage.getAddSauceLabsOnesieToCart();
    }
  }
});

Given('I should see 4 items added to the shopping cart', async function () {
  const count = await swagLabsInventoryPage.getShoppingCartBadge();
  expect(count).toEqual('4');
});

Given('I click on the shopping cart', async function () {
  await swagLabsInventoryPage.getShoppingCartLink();
});

Given(
  'I verify that the QTY count for each item should be {int}',
  async function (expectedQty: number) {
    for (let i = 0; i < 4; i++) {
      const qty = await swagLabsCartPage.getItemQuantity(i);
      expect(qty).toEqual(expectedQty.toString());
    }
  },
);

Given('I remove the following item:', async function (dataTable: DataTable) {
  const items: string[] = dataTable.raw().map((row: string[]) => row[0]);
  for (const item of items) {
    if (item === 'Sauce Labs Fleece Jacket') {
      await swagLabsCartPage.removeSauceLabsFleeceJacketFromCart();
    }
  }
});

Given('I should see 3 items added to the shopping cart', async function () {
  itemCount = await swagLabsInventoryPage.getShoppingCartBadge();
  expect(itemCount).toEqual('3');
});

Given('I click on the CHECKOUT button', async function () {
  await swagLabsCartPage.getCheckout();
});

Given('I type {string} for First Name', async function (firstName: string) {
  await swagLabsCheckoutStepOnePage.setFirstName(firstName);
});

Given('I type {string} for Last Name', async function (lastName: string) {
  await swagLabsCheckoutStepOnePage.setLastName(lastName);
});

Given('I type {string} for ZIP Postal Code', async function (postalCode: string) {
  await swagLabsCheckoutStepOnePage.setPostalCode(postalCode);
});

Given('I click on the CONTINUE button', async function () {
  await swagLabsCheckoutStepOnePage.getContinue();
});

Then('Item total will be equal to the total of items on the list', async function () {
  const setItemCount = Number(itemCount);
  let sum = 0;
  for (let i = 0; i < setItemCount; i++) {
    const priceText = await swagLabsCheckoutStepTwoPage.getItemPrice(i);
    const price = parseFloat(priceText.replace('$', ''));
    sum += price;
  }
  const itemTotalText = await swagLabsCheckoutStepTwoPage.getItemTotal();
  const itemTotal = parseFloat(itemTotalText.replace('Item total: $', ''));
  expect(itemTotal).toEqual(sum);
});

Then('a Tax rate of 8 % is applied to the total', async function () {
  const itemTotalText = await swagLabsCheckoutStepTwoPage.getItemTotal();
  const itemTotal = parseFloat(itemTotalText.replace('Item total: $', ''));
  const taxText = await swagLabsCheckoutStepTwoPage.getTax();
  const tax = parseFloat(taxText.replace('Tax: $', ''));
  const expectedTax = parseFloat((itemTotal * 0.08).toFixed(2));
  const totalText = await swagLabsCheckoutStepTwoPage.getTotal();
  const total = parseFloat(totalText.replace('Total: $', ''));
  const expectedTotal = parseFloat((itemTotal + expectedTax).toFixed(2));
  expect(tax).toEqual(expectedTax);
  expect(total).toEqual(expectedTotal);
});
