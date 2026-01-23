export const getEnv = (key, defaultValue = '') => {
  return import.meta.env[key] || defaultValue;
};

export const getApiUrl = (endpoint = '') => {
  const backendUrl = getEnv('VITE_API_BACKEND_BASE');
  const backendVersion = getEnv('VITE_API_BACKEND_VERSION');
  return `${backendUrl}/${backendVersion}/${endpoint}`;
};

export const getWebsocketUrl = () => {
  const baseUrl = getEnv('VITE_API_BASE_URL').replace('http', 'ws');
  return `${baseUrl}/ws`;
};

export const getAdminApiUrl = () => {
  const backendUrl = getEnv('VITE_API_BACKEND_BASE');
  const backendVersion = getEnv('VITE_API_BACKEND_VERSION');
  console.log(`${backendUrl}/api/${backendVersion}/`)
  return `${backendUrl}/api/${backendVersion}/`;
};
