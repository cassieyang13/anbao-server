import { Reducer } from 'redux';
import { routerRedux, Effect } from 'dva';
import { stringify } from 'querystring';
import { router } from 'umi';
import UserStorage from '@/utils/storage';
import { login } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response) {
        const isLongin = response && response.result === 0;
 
        console.log(response)    
        if (isLongin) {
          yield UserStorage.setUserToken(response.data.token);
          yield UserStorage.setUserInfo(response.data.admin);
          yield message.success('登录成功,正在进入...');
          yield put(routerRedux.replace('/'));
        } else {
          yield message.error('登陆失败');
        }
       
      }
           
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery();

      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
