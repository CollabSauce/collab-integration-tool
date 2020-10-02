export const API_PATH = '/api';
export const AUTH_TOKEN_KEY = 'auth_token';
export const INVITE_MEMBERS_VALUE_SELECT = 'INVITE_MEMBERS';

let basePath = '';
let dashboardUrl = '';
if (process.env.REACT_APP_ENV === 'development') {
  basePath = 'http://localhost:8000';
  dashboardUrl = 'http://localhost:3000';
} else if (process.env.REACT_APP_ENV === 'staging') {
  basePath = 'https://api-staging-collabsauce.herokuapp.com';
  dashboardUrl = 'https://app.staging.collabsauce.com';
} else if (process.env.REACT_APP_ENV === 'production') {
  basePath = 'https://api.collabsauce.com';
  dashboardUrl = 'https://app.collabsauce.com';
}

export const BASE_PATH = basePath;
export const DASHBOARD_URL = dashboardUrl;
