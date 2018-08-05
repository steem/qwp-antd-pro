import exp403 from 'assets/403.svg';
import exp404 from 'assets/404.svg';
import exp500 from 'assets/500.svg';

const config = {
  403: {
    img: exp403,
    title: '403',
    desc: '抱歉，你无权访问该页面',
  },
  404: {
    img: exp404,
    title: '404',
    desc: '抱歉，你访问的页面不存在',
  },
  500: {
    img: exp500,
    title: '500',
    desc: '抱歉，服务器出错了',
  },
};

export default config;
