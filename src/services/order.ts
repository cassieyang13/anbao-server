import request from '@/utils/request';
import { spl } from '@/utils/utils';

// 小区列表查询
export async function getOrderList(params: any): Promise<any> {
  return request(`/order/api/v1/list?${spl(params)}`);
}

// 退款
export async function refund(params: any): Promise<any> {
  return request(`/order/api/v1/refund`, {
    method: 'POST',
    body: params,
    formData: true,
  });
}

// 创建实体卡订单
export async function createOrder(params: any): Promise<any> {
  return request(`/order/api/v1/create`, {
    method: 'POST',
    body: params,
  });
}

// 修改订单
export async function updateOrder(params: any): Promise<any> {
  return request(`/order/api/v1/update`, {
    method: 'POST',
    body: params,
  });
}

// 修改订单
export async function orderPrice(params: {createtime: string, endtime: string, vehType: number, batType?: string, comitId: string}): Promise<any> {
  return request(`/order/api/v1/price?${spl(params)}`, {
    method: 'GET',
  });
}

// 小区详情
export async function comitDetail(params: {comitId: number}): Promise<any> {
  return request(`/comit/api/v1/info?${spl(params)}`, {
    method: 'GET',
  });
}

