import api from './api';

import { Notification } from '@/types/notification';
import Response from '@/types/response';

const NotificationService = {
  getMyNotifications: async () => {
    return (await api.get<Response<Notification[]>>('/notification/my')).data.payload;
  },
};

export default NotificationService;
