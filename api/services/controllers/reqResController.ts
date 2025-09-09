import { RestClient, RestRequest, RestClientResponse, ParameterType } from '../../src/restClient';
import { UserListResponse } from '../models/responses/userListResponse';
import { UserResponse } from '../models/responses/userResponse';
import { RegisterUserResponse } from '../models/responses/registerUserResponse';
import { RegisterUserRequest } from '../models/requests/registerUserRequest';
import { LoginUserResponse } from '../models/responses/loginUserResponse';
import { LoginUserRequest } from '../models/requests/loginUserRequest';

export class ReqResController {
  private readonly baseUrl: string;
  private readonly client: RestClient;

  constructor() {
    this.baseUrl = 'https://reqres.in/api';
    this.client = new RestClient(this.baseUrl);
  }

  public async getDefaultUsers(): Promise<RestClientResponse<UserListResponse>> {
    const endpoint = `/users`;
    const request = new RestRequest(endpoint, 'GET');
    request.addHeader('x-api-key', 'reqres-free-v1');
    const response = await this.client.execute<UserListResponse>(request);
    return response;
  }

  public async getUsersWithDelay(seconds: number): Promise<RestClientResponse<UserListResponse>> {
    const endpoint = `/users`;
    const request = new RestRequest(endpoint, 'GET');
    request.addHeader('x-api-key', 'reqres-free-v1');
    request.addParameter('delay', seconds.toString(), ParameterType.QueryString);
    const response = await this.client.execute<UserListResponse>(request);
    return response;
  }

  public async getAllUsers(): Promise<RestClientResponse<UserListResponse>> {
    const defaultResponse = await this.getDefaultUsers();
    const total = defaultResponse.data?.total ?? 0;
    const endpoint = '/users';
    const request = new RestRequest(endpoint, 'GET');
    request.addHeader('x-api-key', 'reqres-free-v1');
    request.addParameter('per_page', total.toString(), ParameterType.QueryString);
    const response = await this.client.execute<UserListResponse>(request);
    return response;
  }

  public async getUser(id: number): Promise<RestClientResponse<UserResponse>> {
    const endpoint = `/users/${id}`;
    const request = new RestRequest(endpoint, 'GET');
    request.addHeader('x-api-key', 'reqres-free-v1');
    const response = await this.client.execute<UserResponse>(request, true);
    return response;
  }

  public async postRegisterUser(
    email: string,
    password: string,
  ): Promise<RestClientResponse<RegisterUserResponse>> {
    const endpoint = '/register';
    const request = new RestRequest(endpoint, 'POST');
    request.addHeader('x-api-key', 'reqres-free-v1');
    request.addHeader('Content-Type', 'application/json');
    const registerUserRequest: RegisterUserRequest = {
      email: email,
      password: password,
    };
    request.body = registerUserRequest;
    const response = await this.client.execute<RegisterUserResponse>(request, true);
    return response;
  }

  public async postLoginUser(
    email: string,
    password: string,
  ): Promise<RestClientResponse<LoginUserResponse>> {
    const endpoint = '/login';
    const request = new RestRequest(endpoint, 'POST');
    request.addHeader('x-api-key', 'reqres-free-v1');
    request.addHeader('Content-Type', 'application/json');
    const loginUserRequest: LoginUserRequest = {
      email: email,
      password: password,
    };
    request.body = loginUserRequest;
    const response = await this.client.execute<LoginUserResponse>(request, true);
    return response;
  }

  public async countUserIds(data: UserListResponse): Promise<number> {
    const userIds = data.data.length;
    return userIds;
  }
}
