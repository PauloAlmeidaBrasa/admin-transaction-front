import { useMutation, useQueryClient } from '@tanstack/react-query';
import { newsAPIAuth } from '../services/api/api-admin';


export const useLogin = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => newsAPIAuth.getLogin(credentials),
    onSuccess: (data) => {


      localStorage.setItem('auth', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      queryClient.invalidateQueries(['user']);

      if (options.onSuccess) {
        options.onSuccess(data);
      }

    },
    onError: (err) => {
      console.log("LOGIN ERROR:", err);
      if (options.onError) options.onError(err);
    },
  });
};

export const useLogout = (options = {}) => {
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');

    queryClient.clear();

    onSuccess: (data) => {

    queryClient.invalidateQueries(['user']);

      if (options.onSuccess) {
        options.onSuccess(data);
      }

    }
  };

  return logout;
};

export const authenticated = () => {

  console.log(localStorage.getItem('auth'))

  return localStorage.getItem('auth')

} 


export const login = async (credentials) => { 

  console.log(credentials)
  return await newsAPIAuth.getLogin(credentials)
}