import api from './api';

import { Notification } from '@/types/notification';
import Response from '@/types/response';

const NotificationService = {
  getMyNotifications: async () => {
    return (await api.get<Response<Notification[]>>('/notification/my')).data.payload;
  },
  markAllAsRead: async () => {
    return (await api.post<Response<void>>('/notification/read')).data.payload;
  },
  readById: async (id: string) => {
    return (await api.post<Response<void>>(`/notification/${id}/read`)).data.payload;
  },
};

export default NotificationService;
