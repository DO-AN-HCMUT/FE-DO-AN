// TODO: Request new API rules

import api from './api';

const signIn = async (payload: { email: string; password: string }) => {
  return (await api.post('/auth/sign-in', payload)).data;
};

const signUp = async (payload: { email: string; password: string }) => {
  return (await api.post('/auth/sign-up', payload)).data;
};

const authService = {
  signIn,
  signUp,
};

export default authService;
