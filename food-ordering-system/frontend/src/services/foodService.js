import { foodAxios } from '../config/axios';

const FoodService = {
  getAll:    ()         => foodAxios.get('/foods'),
  getById:   (id)       => foodAxios.get(`/foods/${id}`),
  create:    (data)     => foodAxios.post('/foods', data),
  update:    (id, data) => foodAxios.put(`/foods/${id}`, data),
  delete:    (id)       => foodAxios.delete(`/foods/${id}`),
};

export default FoodService;
