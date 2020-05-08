import request from '@/utils/request';
import { spl } from '@/utils/utils';

// 门禁日志列表查询
export async function getLogList(params: any): Promise<any> {
  return request(`/log/access/record/list?${spl(params)}`);
}

// 充电日志列表查询
export async function getChargeLogList(params: any): Promise<any> {
  return request(`/log/charge/record/list?${spl(params)}`);
}


// 退款
export async function refund(params: any): Promise<any> {
  return request('/order/api/v1/refund', {
    method: 'POST',
    body: params,
    formData: true,
  });
}
