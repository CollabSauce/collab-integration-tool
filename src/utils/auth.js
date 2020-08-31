import { AUTH_TOKEN_KEY } from 'src/constants';

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (tokenValue) => {
  if (!tokenValue) {
    return localStorage.removeItem(AUTH_TOKEN_KEY);
  } else {
    return localStorage.setItem(AUTH_TOKEN_KEY, tokenValue);
  }
};
