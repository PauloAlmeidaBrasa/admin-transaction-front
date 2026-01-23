import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPIAuth } from '../services/api/api-admin';


export const useLogin = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => adminAPIAuth.getLogin(credentials),
    onSuccess: (data) => {


      localStorage.setItem('auth', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('access_level', data.user?.access_level || 1);

      queryClient.invalidateQueries(['user']);

      window.dispatchEvent(new Event('authChange'));

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
  const queryClient = useQueryClient()

  return () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    localStorage.removeItem('access_level')

    queryClient.clear()

    // Dispatch custom event to notify other parts of the app about auth change
    window.dispatchEvent(new Event('authChange'));

    options.onSuccess?.()
}

// export const useLogout = (options = {}) => {
//   const queryClient = useQueryClient();

//   const logout = () => {
//     localStorage.removeItem('auth');
//     localStorage.removeItem('user');

//     queryClient.clear();

//     onSuccess: (data) => {

//     queryClient.invalidateQueries(['user']);

//       if (options.onSuccess) {
//         options.onSuccess(data);
//       }

//     }
//   };

//   return logout;
};

export const authenticated = () => {

  console.log(localStorage.getItem('auth'))

  return localStorage.getItem('auth')

} 

export const getAccessLevel = () => {
  return parseInt(localStorage.getItem('access_level') || 1);
} 


export const login = async (credentials) => { 

  console.log(credentials)
  return await adminAPIAuth.getLogin(credentials)
}