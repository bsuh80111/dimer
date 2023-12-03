import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
});
// TODO: Add Auth Interceptor & Global Error Handler?

const baseUrl: string = import.meta.env.VITE_BASE_URL as string;

interface HttpError {
  status: number;
  message: string;
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

interface GetRequestParams<T, S> {
  route: string;
  urlParams: Record<string, string | undefined>,
  transform?: (response: T) => S
}

/**
 * 
 * @param route Route 
 * @param transform 
 * @returns 
 */
const get = async <ResponseData = unknown, FormattedData = unknown>({
  route,
  urlParams,
  transform
}: GetRequestParams<ResponseData, FormattedData>): Promise<ResponseData | FormattedData> => {
  const response = await client.get<ResponseData>(
    getResourceUrl(route, urlParams)
  );

  if (response.status >= 200 && response.status < 300) {
    if (transform) {
      return transform(response.data);
    }
    return response.data;
  }

  throw {
    status: response.status,
    message: `Error: ${response.data}`,
    errorData: response.data
  } as HttpError;
};

export { client, get };
export type { HttpError, GetRequestParams };

