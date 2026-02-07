import { userStore } from '@/store/user';
import { getMiniProgramEnvVersion } from '@/utils/runtime';

type HttpMethod =
  | 'OPTIONS'
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT';

type RequestPayload = string | WechatMiniprogram.IAnyObject | ArrayBuffer;

export interface RequestConfig<TData = RequestPayload> {
  url: string;
  method?: HttpMethod;
  data?: TData;
  header?: WechatMiniprogram.IAnyObject;
  timeout?: number;
}

interface ErrorResponsePayload {
  message?: string;
  msg?: string;
  code?: number;
}

type RequestSuccessResult =
  WechatMiniprogram.RequestSuccessCallbackResult<RequestPayload>;

function getBaseURL(): string {
  const envVersion = getMiniProgramEnvVersion();

  if (envVersion === 'release') {
    return 'https://api.fuyeai.cn/api';
  }

  // develop / trial 统一走本地调试网关
  return 'http://localhost:3000/api';
}

function joinURL(baseURL: string, url: string): string {
  if (/^https?:\/\//.test(url)) {
    return url;
  }

  const base = baseURL.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;

  return `${base}${path}`;
}

function getErrorMessageFromData(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }

  if (data && typeof data === 'object') {
    const payload = data as ErrorResponsePayload;
    return payload.message || payload.msg || '请求失败';
  }

  return '请求失败';
}

function handleUnauthorized(): void {
  userStore.logout();

  wx.showToast({
    title: '登录已失效，请重新登录',
    icon: 'none',
  });

  // 防止重复跳转：若已在登录页则不再跳
  const pages = getCurrentPages();
  const currentRoute = pages[pages.length - 1]?.route;

  if (currentRoute !== 'pages/login/login') {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  }
}

export function request<
  T = WechatMiniprogram.IAnyObject,
  TData extends RequestPayload = RequestPayload,
>(
  config: RequestConfig<TData>,
): Promise<T> {
  const baseURL = getBaseURL();
  const token = wx.getStorageSync('fuyeai_token') || '';

  // Request 拦截器：统一注入 Token
  const requestHeader: WechatMiniprogram.IAnyObject = {
    'content-type': 'application/json',
    ...(config.header || {}),
  };

  if (token) {
    requestHeader.Authorization = `Bearer ${token}`;
  }

  return new Promise<T>((resolve, reject) => {
    wx.request({
      url: joinURL(baseURL, config.url),
      method: config.method || 'GET',
      data: config.data,
      header: requestHeader,
      timeout: config.timeout ?? 15000,
      success: (response) => {
        const typedResponse = response as RequestSuccessResult;
        const { statusCode, data } = typedResponse;

        // Response 拦截器：统一处理业务状态码
        if (statusCode === 200) {
          resolve(data as T);
          return;
        }

        if (statusCode === 401) {
          handleUnauthorized();
          reject(new Error('未登录或登录态过期'));
          return;
        }

        const errorMessage = getErrorMessageFromData(data);
        wx.showToast({
          title: errorMessage,
          icon: 'none',
        });

        reject(new Error(errorMessage));
      },
      fail: (error) => {
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none',
        });
        reject(error);
      },
    });
  });
}

request.get = function get<T = WechatMiniprogram.IAnyObject>(
  url: string,
  data?: WechatMiniprogram.IAnyObject,
  config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
): Promise<T> {
  return request<T>({
    ...(config || {}),
    url,
    data,
    method: 'GET',
  });
};

request.post = function post<T = WechatMiniprogram.IAnyObject>(
  url: string,
  data?: WechatMiniprogram.IAnyObject,
  config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
): Promise<T> {
  return request<T>({
    ...(config || {}),
    url,
    data,
    method: 'POST',
  });
};
