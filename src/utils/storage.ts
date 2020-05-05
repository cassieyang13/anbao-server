import _ from 'lodash';

class UserStorage {
  static async setUserToken(token: string) {
    window.localStorage.setItem('token', token);
  }

  static getUserToken() {
    return window.localStorage.getItem('token');
  }

  static removeUserToken() {
    window.localStorage.removeItem('token');
  }

  static removeOsstoken() {
    window.localStorage.removeItem('osstoken');
  }

  static clearUserLogin() {
    window.localStorage.clear();
  }

  static setUserInfo(info: any) {
    window.localStorage.setItem('user', JSON.stringify(info));
  }

  static getUserInfo() {
    const info = window.localStorage.getItem('user');
    if (info) {
      return JSON.parse(info);
    }
    return {};
  }

  static removeUserInfo() {
    window.localStorage.removeItem('user');
  }

  static getUserName() {
    const info = window.localStorage.getItem('user');
    if (info) {
      const obj = JSON.parse(info);
      if (_.isObject(obj)) {
        return (obj as any).userName;
      }
    }
    return null;
  }
}

export default UserStorage;
