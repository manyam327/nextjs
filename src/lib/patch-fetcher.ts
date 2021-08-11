import axios from 'axios';

const fetcher = async (url: any, data: any, config?: any, alertRef?: any) =>
  axios
    .patch(url, data, config)
    .then((res) => {
      if (res.data && res.data.message) {
        alertRef?.current?.showAlert('success', res.data.message);
      }
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

export default fetcher;
