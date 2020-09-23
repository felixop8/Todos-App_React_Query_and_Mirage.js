import axios from 'axios';

const apiConfig = {
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/json'
  }
};

const axiosConfig = axios.create(apiConfig);

export default axiosConfig;
