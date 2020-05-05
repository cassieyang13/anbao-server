import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

// export async function fakeAccountLogin(params: LoginParamsType) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// 登陆
export async function login(params: any): Promise<any> {
  return request(`/admin/login`, {
    method: 'POST',
    body: params,
    formData: true,
  });
}

// 登陆
export async function logout(): Promise<any> {
  return request(`/admin/logout`, {
    method: 'POST',
  });
}