type Response<T> = {
  payload: T;
  success: boolean;
  message: string;
};

export default Response;
