import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { ReqResController } from '../services/controllers/reqResController';
import { UserListResponse } from '../services/models/responses/userListResponse';
import { RestClientResponse } from '../src/restClient';
import { expect } from 'chai';
import { UserResponse } from '../services/models/responses/userResponse';
import { RegisterUserResponse } from '../services/models/responses/registerUserResponse';
import { LoginUserResponse } from '../services/models/responses/loginUserResponse';

const reqResController = new ReqResController();

let userListResponse: RestClientResponse<UserListResponse>;
let userResponse: RestClientResponse<UserResponse>;
let registerUserResponse: RestClientResponse<RegisterUserResponse>;
let loginUserResponse: RestClientResponse<LoginUserResponse>;
let totalUsers: number;
let userIdCount: number;

Given('I get the default list of users for on 1st page', async function () {
  userListResponse = await reqResController.getAllUsers();
  expect(userListResponse.status).to.equal(200);
});

When('I get the list of all users within every page', async function () {
  totalUsers = userListResponse.data?.total ?? 0;
  userIdCount = await reqResController.countUserIds(userListResponse.data!);
});

Then('I should see total users count equals the number of user ids', async function () {
  expect(userIdCount).to.equal(totalUsers);
});

Given('I make a search for user {int}', async function (userId: number) {
  userResponse = await reqResController.getUser(userId);
});

Then('I should see the following user data', function (dataTable: DataTable) {
  const expectedData = dataTable.hashes()[0];
  expect(userResponse.status).to.equal(200);
  expect(userResponse.data?.data.first_name).to.equal(expectedData.first_name);
  expect(userResponse.data?.data.email).to.equal(expectedData.email);
});

Then('I receive error code {int} in response', function (errorCode: number) {
  expect(userResponse.status).to.equal(errorCode);
});

Given(
  'I create a user with following {string} {string}',
  async function (email: string, password: string) {
    registerUserResponse = await reqResController.postRegisterUser(email, password);
    expect(registerUserResponse.status).to.equal(200);
  },
);

Then('response should contain id and token', function () {
  expect(registerUserResponse.data?.id !== undefined).to.equal(true);
  expect(registerUserResponse.data?.token !== undefined).to.equal(true);
});

Given('I login successfully with the following data', async function (dataTable: DataTable) {
  const row = dataTable.hashes()[0];
  loginUserResponse = await reqResController.postLoginUser(row.Email, row.Password);
});

Then('I should get a response code of {int}', function (expectedCode) {
  expect(loginUserResponse.status).to.equal(expectedCode);
});

Given('I login unsuccessfully with the following data', async function (dataTable: DataTable) {
  const row = dataTable.hashes()[0];
  loginUserResponse = await reqResController.postLoginUser(row.Email, row.Password);
});

Then('I should see the following response message:', function (dataTable: DataTable) {
  const expected = dataTable.raw();
  const expectedError = expected[0][0].replace(/"error":\s*/, '').replace(/"/g, '');
  expect(loginUserResponse.data?.error).to.equal(expectedError);
});

Given('I wait for the user list to load', async function () {
  userListResponse = await reqResController.getUsersWithDelay(3); // You need to implement getUsersWithDelay
  expect(userListResponse.status).to.equal(200);
});

Then('I should see that every user has a unique id', function () {
  const ids = userListResponse.data?.data?.map((user) => user.id) ?? [];
  const uniqueIds = new Set(ids);
  expect(uniqueIds.size).to.equal(ids.length);
});
