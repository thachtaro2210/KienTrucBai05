import { userAxios } from '../config/axios';

const UserService = {
  register: (data) => userAxios.post('/users/register', data),
  login:    (data) => userAxios.post('/users/login', data),
  getAll:   ()     => userAxios.get('/users'),
  getById:  (id)   => userAxios.get(`/users/${id}`),
};

export default UserService;
