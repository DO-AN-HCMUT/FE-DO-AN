import api from './api';

import { GetAllProjectDto } from '@/types/project';
import Response from '@/types/response';
import User from '@/types/user';

const BASE_URL = '/user';

const getMyProjects = async () => {
  return (await api.get<Response<GetAllProjectDto>>(`${BASE_URL}/projects`)).data.payload;
};

const getUserByEmail = async (email: string) => {
  return (await api.post<Response<User>>(`${BASE_URL}/email`, { email })).data.payload;
};

const getMe = async () => {
  return (await api.get<Response<User>>(`${BASE_URL}/me`)).data.payload;
};

const UserService = { getMyProjects, getUserByEmail, getMe };

export default UserService;
