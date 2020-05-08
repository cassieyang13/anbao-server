import { notification } from 'antd';
import router from 'umi/router';
import _ from 'lodash';
import UserStorage from '@/utils/storage';
import Urls from './urls';
import { buildFormData } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

async function errHandle<T>(pro: Promise<T>) {
  try {
    const res: any = await pro;
    notification.error({
      message: '系统通知',
      description: '系统错误',
    });
  } catch (error) {
    console.log(error);
  }
}

async function checkStatus(response: any, newOptions: any) {
  if (response.status >= 200 && response.status < 300) {
    if (newOptions.method === 'DELETE' || response.status === 204) {
      return Promise.resolve(response.text());
    }
    // if (res.result === 401) {
    //   UserStorage.clearUserLogin();
    //   router.push('/user/login');
    //   Promise.reject(res)
    //   return;
    // }
    return Promise.resolve(response.json());
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: '系统通知',
  //   description: errortext,
  // });
  const error = new Error(errortext);
  error.name = response.status;
  error.message = errortext;
  errHandle(Promise.resolve(response.json()));
  throw error;
}


function checkException (response) {

}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
interface IMyOptionObj {
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
  body?: any;
  headers?: any;
  credentials?: any;
  formData?: boolean;
}

export default async function request(url: string, options: IMyOptionObj = {}) {
  const { formData, method = 'GET' } = options;
  // const defaultOptions = {
  //   credentials: 'include', // cookie
  // };
  const token = UserStorage.getUserToken();
  console.log(token)
  const newOptions: IMyOptionObj = {
    // ...defaultOptions,
    ...options,
    // credentials: 'include',
    headers: {
      token,
    },
  };
  if (formData) {
    newOptions.body = buildFormData(newOptions.body);
    newOptions.headers = {
      ...newOptions.headers,
    };
  }
  if ((method === 'POST' || method === 'PUT') && !formData) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    }
  }
  return fetch(Urls.getUrl(url), newOptions)
    .then(res => checkStatus(res, newOptions))
    .then(response => {
      if (response.result === 401) {
        UserStorage.clearUserLogin();
        router.push('/user/login');
        return;
      }
      return Promise.resolve(response);
    })
    .catch(err => {
      console.log(err)
      const status = err.name;
      // if (status === 401) {
      //   UserStorage.clearUserLogin();
      //   router.push('/user/login');
      //   return;
      // }
      if (status === 400) {
        return;
      }
      if (status <= 504 && status >= 500) {
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
      Promise.resolve({});
    });
}
