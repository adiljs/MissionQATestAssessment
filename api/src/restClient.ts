import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import https from 'https';

const toErrorMessage = (err: unknown): string => (err instanceof Error ? err.message : String(err));

export enum ParameterType {
  UrlSegment = 'UrlSegment',
  QueryString = 'QueryString',
  Header = 'Header',
  Body = 'Body',
}

export class RestRequest {
  endpoint: string;

  method: string;

  urlSegments: Record<string, string | number> = {};

  queryParams: Record<string, string | number | boolean | undefined> = {};

  headers: Record<string, string> = {};

  body: unknown;

  constructor(endpoint: string, method: string) {
    this.endpoint = endpoint;
    this.method = method;
  }

  addParameter(key: string, value: unknown, type: ParameterType) {
    switch (type) {
      case ParameterType.UrlSegment:
        this.urlSegments[key] = value as string | number;
        break;
      case ParameterType.QueryString:
        this.queryParams[key] = value as string | number | boolean | undefined;
        break;
      case ParameterType.Header:
        this.headers[key] = String(value);
        break;
      case ParameterType.Body:
        this.body = value;
        break;
    }
  }

  addHeader(key: string, value: string) {
    this.headers[key] = value;
  }
}

export interface RestClientResponse<T = unknown> {
  status: number;
  ok: boolean;
  statusText?: string;
  statusDescription?: string;
  data?: T;
  error?: string;
  errorBody?: unknown;
  request?: RestRequest;
  contentType?: string | undefined;
  contentLength?: number | null;
  contentEncoding?: string[];
  content?: string;
  isSuccessfulStatusCode?: boolean;
  isSuccessful?: boolean;
  rawBytes?: Uint8Array | undefined;
  responseUri?: string | undefined;
  server?: string | undefined;
  cookies?: string[];
  headers?: Record<string, string>;
  contentHeaders?: Record<string, string>;
  errorMessage?: string;
  errorException?: unknown;
  version?: string;
  rootElement?: string;
}

export interface RequestOptions {
  urlSegments?: Record<string, string | number>;
  queryParams?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  body?: unknown;
}

export class RestClient {
  baseUrl: string;

  client: AxiosInstance;

  private ignoreSsl = false;

  static disableSSLVerification() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  static create(baseUrl: string, axiosInstance?: AxiosInstance): RestClient {
    return new RestClient(baseUrl, axiosInstance);
  }

  constructor(baseUrl: string, axiosInstance?: AxiosInstance) {
    this.baseUrl = baseUrl;
    if (axiosInstance) {
      this.client = axiosInstance;
    } else {
      this.client = axios.create({ baseURL: baseUrl, validateStatus: () => true });
    }
  }

  private buildUrl(request: RestRequest): string {
    let finalEndpoint = request.endpoint;
    if (request.urlSegments) {
      for (const [key, value] of Object.entries(request.urlSegments)) {
        finalEndpoint = finalEndpoint.replace(`{${key}}`, encodeURIComponent(String(value)));
      }
    }
    let queryString = '';
    if (request.queryParams) {
      const params = Object.entries(request.queryParams)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');
      if (params) queryString = `?${params}`;
    }
    if (/^https?:\/\//i.test(finalEndpoint)) {
      return `${finalEndpoint}${queryString}`;
    }
    const fullUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const fullEndpoint = finalEndpoint.startsWith('/') ? finalEndpoint : `/${finalEndpoint}`;
    return `${fullUrl}${fullEndpoint}${queryString}`;
  }

  async execute<TResponse = unknown>(
    request: RestRequest,
    suppressError = false,
  ): Promise<RestClientResponse<TResponse>> {
    const url = this.buildUrl(request);

    const axiosConfig: AxiosRequestConfig = {
      url,
      method: request.method as Method,
      headers: request.headers || {},
      params: request.queryParams,
      responseType: 'arraybuffer',
      validateStatus: () => true,
    };

    if (request.body !== undefined && !(request.method === 'GET' || request.method === 'HEAD')) {
      axiosConfig.data = request.body;
      if (!axiosConfig.headers || !axiosConfig.headers['Content-Type']) {
        axiosConfig.headers = { ...axiosConfig.headers, 'Content-Type': 'application/json' };
      }
    }

    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
      axiosConfig.httpsAgent = new https.Agent({ rejectUnauthorized: false });
      this.ignoreSsl = true;
    }

    let res: AxiosResponse<ArrayBuffer>;
    try {
      res = await this.client.request<ArrayBuffer>(axiosConfig);
    } catch (err: unknown) {
      return {
        status: 0,
        ok: false,
        error: toErrorMessage(err),
        errorException: err,
        responseUri: url,
      } as RestClientResponse<TResponse>;
    }

    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(res.headers || {})) {
      if (Array.isArray(v)) {
        headers[k] = v.join(', ');
      } else if (typeof v === 'string') {
        headers[k] = v;
      } else if (v === undefined || v === null) {
        // skip
      } else {
        headers[k] = String(v);
      }
    }

    const contentType = headers['content-type'];
    const contentLength = headers['content-length'] ? parseInt(headers['content-length']) : null;
    const cookies: string[] = [];
    if (res.headers && res.headers['set-cookie']) {
      const sc = res.headers['set-cookie'];
      if (Array.isArray(sc)) cookies.push(...sc.map(String));
      else cookies.push(String(sc));
    }

    let rawContent: string | undefined;
    let data: unknown;
    try {
      if (res.data instanceof ArrayBuffer || ArrayBuffer.isView(res.data)) {
        const buf = Buffer.from(res.data as ArrayBuffer);
        rawContent = buf.toString('utf8');
        if (contentType && contentType.includes('application/json')) {
          try {
            data = JSON.parse(rawContent);
          } catch {
            data = rawContent;
          }
        } else {
          data = rawContent;
        }
      } else {
        data = res.data as unknown;
        if (typeof data === 'object' && data !== null) {
          try {
            rawContent = JSON.stringify(data);
          } catch {
            rawContent = String(data);
          }
        } else if (data !== undefined) {
          rawContent = String(data);
        }
      }
    } catch {
      data = undefined;
    }

    const isSuccessfulStatusCode = res.status >= 200 && res.status < 300;
    const isSuccessful = isSuccessfulStatusCode;

    if (!isSuccessful) {
      const errorObj = {
        message: `HTTP ${res.status} ${res.statusText}`,
        response: {
          status: res.status,
          ok: false,
          statusText: res.statusText,
          data,
          request,
          contentType,
          contentLength,
          contentEncoding: headers['content-encoding'] ? [headers['content-encoding']] : [],
          content: rawContent,
          rawBytes: res.data ? Buffer.from(res.data as ArrayBuffer) : undefined,
          responseUri: url,
          server: headers['server'],
          headers,
          cookies,
        },
      };
      if (suppressError) {
        return {
          status: res.status,
          ok: false,
          statusText: res.statusText,
          data: data as TResponse,
          request,
          contentType,
          contentLength,
          contentEncoding: headers['content-encoding'] ? [headers['content-encoding']] : [],
          content: rawContent,
          isSuccessfulStatusCode,
          isSuccessful,
          rawBytes: res.data ? new Uint8Array(Buffer.from(res.data as ArrayBuffer)) : undefined,
          responseUri: url,
          server: headers['server'],
          headers,
          cookies,
          error: errorObj.message,
          errorBody: errorObj.response,
        };
      }
      throw errorObj;
    }

    const successResponse: RestClientResponse<TResponse> = {
      status: res.status,
      ok: true,
      statusText: res.statusText,
      data: data as TResponse,
      request,
      contentType,
      contentLength,
      contentEncoding: headers['content-encoding'] ? [headers['content-encoding']] : [],
      content: rawContent,
      isSuccessfulStatusCode,
      isSuccessful,
      rawBytes: res.data ? new Uint8Array(Buffer.from(res.data as ArrayBuffer)) : undefined,
      responseUri: url,
      server: headers['server'],
      headers,
      cookies,
    };

    return successResponse;
  }
}
