import api from './api';

import Response from '@/types/response';
import { GetMyTaskDto } from '@/types/task';

const BASE_URL = '/task';

const getMyTasks = async (search?: string, isDueToday?: boolean) => {
  return (
    await api.get<Response<GetMyTaskDto>>(
      `${BASE_URL}/getAll?${search ? `search=${search}` : ''}${isDueToday ? `&dueToday=${isDueToday}` : ''}`,
    )
  ).data.payload;
};

const taskService = { getMyTasks };

export default taskService;
