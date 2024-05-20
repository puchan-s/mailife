import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export default class RetryableAxios {
  private axiosInstance = axios.create();
  private maxRetries: number;

  constructor(maxRetries: number) {
    this.maxRetries = maxRetries;
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        let retryCount = 0;
        let delay = 1000; // リトライ間隔（ミリ秒）

        while (retryCount < this.maxRetries) {
          retryCount++;
          console.log(`Retrying request (attempt ${retryCount})...`);
          try {
            if(!error && !error.config ){
                await new Promise(resolve => setTimeout(resolve, delay)); // delayミリ秒待機
                const response = await this.axiosInstance.request({
                method: error.config.method,
                url: error.config.url,
                data: error.config.data,
                headers: error.config.headers,
                });
                return response;
            }
          } catch (error) {
            console.error('Retry failed:', error);
          }
        }

        // リトライが失敗した場合はエラーをスローする
        throw error;
      }
    );
  }

  public async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.axiosInstance.request(config);
  }
}
