

import axios from 'axios';
import { getApiUrl } from '../../utils/env';


const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}


// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // only handle 401 once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is already happening, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {


        const res = await api.get(getApiUrl('refresh'));
        const newAccessToken = res.data.access_token;

        localStorage.setItem('auth', newAccessToken);
        api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;


        // notify queued requests
        onRefreshed(newAccessToken);
        isRefreshing = false;

        // retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        console.error('Token refresh failed:', refreshError);
        // optionally redirect to login
        sessionStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const adminAPIAuth = {
  getLogin: async (credentials) => {
    return  api.post(getApiUrl('authentication'),credentials,{withCredentials:true}).then((res) => {

      return res.data;
    })
  },
};

export const newsAPI = {
  add: (data) =>api.post(getApiUrl('user/add-user'), data),
};


export const adminAPIUser = {
  getAll: async () => {
    return api.get(getApiUrl('user/get-users')) 
  },
  getById: async (userId) => {
    return api.get(getApiUrl('user/get-users'), {
      params: { user_ID: userId }
    })
  },
  update: async (params) => {
    return api.patch(getApiUrl('user/update'), params.payload)
  },
  add: (data) => {
    api.post(getApiUrl('user/add-user'), data)
  },
  delete: (id) => api.post(getApiUrl('user/delete'),{user_ID: id}),
};


export const adminAPITransaction = {
  getAll: async () => {
    return api.get(getApiUrl('transactions')) 
  },
  getById: async (transactionId) => {
    return api.get(getApiUrl(`transaction/${transactionId}`), {
    })
  },
  // add: (data) =>api.post(getApiUrl('/add'), data),
  update: async (id,data) => {
    return api.patch(getApiUrl(`transaction/update/${id}`), data)
  },
  delete: (id) => api.post(getApiUrl(`transaction/delete/${id}`)),
};


export default api;