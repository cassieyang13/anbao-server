import request from '@/utils/request';
import { spl } from '@/utils/utils';

// 门禁列表查询
export async function getAccessList(params: any): Promise<any> {
  return request(`/device/api/v1/access/list?${spl(params)}`);
}

// 新增门禁
export async function addAccess(params: any): Promise<any> {
  return request(`/device/api/v1/access/add`, {
    method: 'PUT',
    body: params,
    formData: true,
  });
}

// 编辑门禁
export async function editAccess(params: any): Promise<any> {
    return request(`/device/api/v1/access/update`, {
      method: 'POST',
      body: params,
      formData: true,
    });
  }
  // 删除门禁
export async function deleteAccess(params: any): Promise<any> {
    return request(`/device/api/v1/access/delete?${spl(params)}`, {
      method: 'DELETE',
    });
  }


  // 充电列表查询
export async function getChargeList(params: any): Promise<any> {
  return request(`/device/api/v1/charge/list?${spl(params)}`);
}

// 新增充电
export async function addCharge(params: any): Promise<any> {
  return request(`/device/api/v1/charge/add`, {
    method: 'PUT',
    body: params,
    formData: true,
  });
}

// 编辑充电
export async function editCharge(params: any): Promise<any> {
    return request(`/device/api/v1/charge/update`, {
      method: 'POST',
      body: params,
      formData: true,
    });
  }
  // 编辑充电
export async function deleteCharge(params: any): Promise<any> {
    return request(`/device/api/v1/charge/delete?${spl(params)}`, {
      method: 'DELETE',
    });
  }
