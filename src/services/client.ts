import request from '@/utils/request';
import { spl } from '@/utils/utils';

// 小区列表查询
export async function getUserList(params: any): Promise<any> {
  return request(`/user/api/v1/list?${spl(params)}`);
}

// 新增用户
export async function addUser(params: any): Promise<any> {
  return request('/comit/api/v1/add', {
    method: 'PUT',
    body: params,
    formData: true,
  });
}

// 编辑用户
export async function eitUser(params: any): Promise<any> {
    return request('/comit/api/v1/update', {
      method: 'POST',
      body: params,
      formData: true,
    });
  }
  // 删除用户
export async function deleteUser(params: any): Promise<any> {
    return request(`/user/api/v1/delete?${spl(params)}`, {
      method: 'DELETE',
    });
  }
