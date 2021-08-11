import axios from 'axios';

const fetcher = (url: any, config?: any, alertRef?: any) => {
  const splitUrlArr = url.split('/');
  if (splitUrlArr[splitUrlArr.length - 1] === 'new') {
    return <any>{};
  }
  return axios
    .get(url, config)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      if (err.response && err.response.data && err.response.data.message) {
        alertRef?.current?.showAlert('danger', err.response.data.message);
        if (err.response.data.statusCode && err.response.data.statusCode === 401) {
          sessionStorage.clear();
          sessionStorage.setItem('message', 'Session Expired! You need to login again to continue!');
          window.location.href = '/login';
        }
      }
    });
};

export default fetcher;
