import request from '@/utils/request';
import { spl } from '@/utils/utils';

// 小区列表查询
export async function getComitList(params: any): Promise<any> {
  return request(`/comit/api/v1/list?${spl(params)}`);
}

// 新增小区
export async function addComit(params: any): Promise<any> {
  return request(`/comit/api/v1/add`, {
    method: 'PUT',
    body: params,
  });
}

// 编辑小区
export async function eitComit(params: any): Promise<any> {
  return request(`/comit/api/v1/update`, {
    method: 'POST',
    body: params,
  });
}
// 删除小区
export async function deleteComit(params: any): Promise<any> {
  return request(`/comit/api/v1/delete?${spl(params)}`, {
    method: 'DELETE',
  });
}

// 生成小区二维码
export async function comitQrCode(params: {comitId: number, type: string}): Promise<any> {
  return request(`/comit/api/v1/delete?${spl(params)}`, {
    method: 'POST',
    formData: true,
  });
}
