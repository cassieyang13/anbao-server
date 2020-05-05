// const urlConfig = require('../../urlConfig.json')
const UrlList = {
  // dev: window.location.href,
  dev: 'https://www.castac.online/access-server',
  // test: 'http://10.39.1.47:9998',
  // production: 'https://www.castac.online',
};

const dev = process.env.NODE_TYPE;
console.log(process.env.NODE_ENV)
class Urls {
  public ossUrl = '阿里云上传的url';

  public getUrl = (url: string) => {
    // const Url = url.replace(/\/api/, '');
    // console.log(urlConfig)
    // if (urlConfig.url) {
    //   return urlConfig.url + url
    // }
    console.log(process.env)
    const getWebRootPath = function () {
      let a = window.document.location.href;//
      let b = window.document.location.pathname;
      const pos = a.indexOf(b);
      const path = a.substring(0, pos);
      a = a.substring(a.indexOf("/") + 2, a.length);
      a = a.substring(a.indexOf("/") + 1, a.length);
      const pathName = a.substring(0, a.indexOf("/"));
      return path + "/" + pathName;
      }     
      console.log(getWebRootPath())
      // return getWebRootPath() + url;
      return process.env.NODE_ENV === 'development'  ? UrlList['dev'] + url : getWebRootPath() + url;
    // return UrlList['dev'] + url;
  };
}

export default new Urls();
