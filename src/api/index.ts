import { request } from '@/utils/request';

export interface PingData {
  message: string;
  timestamp: number;
}

/**
 * 示例 API：用于演示如何在业务层复用 request 封装
 */
export function fetchPing(): Promise<PingData> {
  return request<PingData>({
    url: '/ping',
    method: 'GET',
  });
}

