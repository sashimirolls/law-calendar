import axios, { AxiosInstance } from 'axios';
import { acuityConfig } from './config';
import { Logger } from '../../utils/logger';
import { encodeBase64 } from '../../utils/encoding';

function createAcuityClient() {
  const client = axios.create({
    baseURL: acuityConfig.baseUrl,
    timeout: acuityConfig.timeout,
    headers: {
      ...acuityConfig.headers
    }
  });

  // Add request interceptor for logging
  client.interceptors.request.use(
    (config) => {
      Logger.debug('AcuityClient', 'Request:', {
        method: config.method,
        url: config.url,
        params: config.params
      });
      return config;
    },
    (error) => {
      Logger.error('AcuityClient', 'Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for logging
  client.interceptors.response.use(
    (response) => {
      Logger.debug('AcuityClient', 'Response:', {
        status: response.status,
        data: Array.isArray(response.data) ? 
          `Array(${response.data.length})` : 
          response.data
      });
      return response;
    },
    (error) => {
      Logger.error('AcuityClient', 'Response Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      return Promise.reject(error);
    }
  );

  return client;
}

export const acuityClient = createAcuityClient();