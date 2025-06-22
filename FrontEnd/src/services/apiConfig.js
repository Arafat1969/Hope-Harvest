import axios from 'axios';

// const API_BASE_URLs = {
//   USER_SERVICE: 'http://localhost:8085/api/v1',
//   DONATION_SERVICE: 'http://localhost:8080/api/v1',
//   EVENT_SERVICE: 'http://localhost:8090/api/v1'
// };

const API_BASE_URLs = {
  USER_SERVICE: 'http://74.225.246.127:8085/api/v1',
  DONATION_SERVICE: 'http://74.225.246.127:8080/api/v1',
  EVENT_SERVICE: 'http://74.225.246.127:8090/api/v1'
};

const createAuthenticatedAxios = () => {
  const instance = axios.create();
  
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            console.log('Token expired, should refresh or redirect to login');
          } catch (refreshError) {
            localStorage.clear();
            window.location.href = '/login';
          }
        } else {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const authAxios = createAuthenticatedAxios();
export { API_BASE_URLs };

