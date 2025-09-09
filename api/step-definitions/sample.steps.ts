import { Given, When, Then } from '@cucumber/cucumber';
import { RestClient, RestRequest, RestClientResponse } from '../src/restClient';
import { expect } from 'chai';

let client: RestClient;
let response: RestClientResponse<unknown>;

Given('I set the API base URL to {string}', function (baseUrl: string) {
  client = new RestClient(baseUrl);
});

When('I GET {string}', async function (path: string) {
  const req = new RestRequest(path, 'GET');
  response = await client.execute(req);
});

Then('the response status should be {int}', function (status: number) {
  expect(response.status).to.equal(status);
});

Then(
  'the response body should contain a property {string} with value {int}',
  function (prop: string, val: number) {
    expect(response.data as Record<string, unknown>).to.have.property(prop, val);
  },
);
