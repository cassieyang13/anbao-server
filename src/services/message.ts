import request from '@/utils/request';
import { spl } from '@/utils/utils';

// 获取banner
export async function getBannerShow(): Promise<any> {
  return request(`/banner/api/show`, {
    method: 'GET',
  });
}

// 获取banner
export async function setBanner(params: { banner: string }): Promise<any> {
  return request(`/banner/api/set?${spl(params)}`, {
    method: 'GET',
  });
}
