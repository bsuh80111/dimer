import axios, { AxiosResponse } from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000
});
// TODO: Add Auth Interceptor & Global Error Handler?

const baseUrl: string = import.meta.env.VITE_BASE_URL as string;

interface HttpError {
  status: number;
  message: string;
}

interface ResponseBody {
  message?: string;
}

/**
 * Utility function that creates a URL of the resource to access.
 * @param route Route of the resource.
 * @param urlParams URL query parameters to add to the resource request.
 * @returns Full URL of the resource.
 */
const getResourceUrl = (route: string, urlParams?: Record<string, string | undefined>) => {
  let url = baseUrl + route;
  let urlParametersString = '';

  if (urlParams) {
    for (const key in urlParams) { // Iterate through url params object
      if (key && urlParams[key]) {
        urlParametersString += `${urlParametersString.length === 0 ? '' : '&'}${key}=${urlParams[key]}`; // Add URL param string if param provided
      }
    }

    if (urlParametersString) {
      url += `?${urlParametersString}`;
    }
  }

  return url;
};

interface RequestParams<T, S> {
  route: string;
  urlParams?: Record<string, string | undefined>,
  transformResponse?: (response: T) => S
}

interface RequestParamsWithBody<D, E, T, S> extends RequestParams<T, S> {
  body: D;
  transformBody?: (body: D) => E;
}

/**
 * Utility function that executes a GET request. Throws an HTTP Error on unsuccessful requests.
 * @param RequestParams Options for the request. Includes route, url parameters, and data transformation options.
 * @returns HTTP response body of the GET request. If transform function provided, will transform the response body before returning.
 */
const getRequest = async <ResponseData = unknown, FormattedData = ResponseData>({
  route,
  urlParams,
  transformResponse
}: RequestParams<ResponseData, FormattedData>): Promise<ResponseData | FormattedData> => {
  const response = await client.get<ResponseData>(
    getResourceUrl(route, urlParams)
  );

  if (response.status >= 200 && response.status < 300) {
    if (transformResponse) {
      return transformResponse(response.data);
    }
    return response.data;
  }

  throw {
    status: response.status,
    message: `Error: ${response.data}`,
    errorData: response.data
  } as HttpError;
};

/**
 * Utility function that executes a POST request. Throws an HTTP Error on unsuccessful requests.
 * @param RequestParamsWithBody Options for the request. Includes route, body, url parameters, and data transformation options.
 * @returns HTTP response body of the POST request. If transform function provided, will transform the response body before returning.
 */
const postRequest = async <Body = unknown, FormattedBody = Body, ResponseData = unknown, FormattedData = ResponseData>({
  route,
  urlParams,
  body,
  transformResponse,
  transformBody
}: RequestParamsWithBody<Body, FormattedBody, ResponseData, FormattedData>): Promise<ResponseData | FormattedData> => {
  const response = await client.post<ResponseData, AxiosResponse<ResponseData>, Body | FormattedBody>(
    getResourceUrl(route, urlParams),
    transformBody?.(body) ?? body
  );

  if (response.status >= 200 && response.status < 300) {
    if (transformResponse) {
      return transformResponse(response.data);
    }
    return response.data;
  }

  throw {
    status: response.status,
    message: `Error: ${response.data}`,
    errorData: response.data
  } as HttpError;
};

/**
 * Utility function that executes a DELETE request. Throws an HTTP Error on unsuccessful requests.
 * @param RequestParams Options for the request. Includes route, url parameters, and data transformation options.
 * @returns HTTP response body of the DELETE request. If transform function provided, will transform the response body before returning.
 */
const deleteRequest = async <ResponseData = unknown, FormattedData = ResponseData>({
  route,
  urlParams,
  transformResponse
}: RequestParams<ResponseData, FormattedData>): Promise<ResponseData | FormattedData> => {
  const response = await client.delete<ResponseData>(
    getResourceUrl(route, urlParams)
  );

  if (response.status >= 200 && response.status < 300) {
    if (transformResponse) {
      return transformResponse(response.data);
    }
    return response.data;
  }

  throw {
    status: response.status,
    message: `Error: ${response.data}`,
    errorData: response.data
  } as HttpError;
};


export { client, getRequest, postRequest, deleteRequest };
export type { HttpError, ResponseBody, RequestParams, RequestParamsWithBody };

