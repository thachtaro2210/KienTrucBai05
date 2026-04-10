import { orderAxios } from '../config/axios';

const OrderService = {
  create:      (data)    => orderAxios.post('/orders', data, { timeout: 20_000 }),
  getAll:      ()        => orderAxios.get('/orders'),
  getById:     (id)      => orderAxios.get(`/orders/${id}`),
  getByUser:   (userId)  => orderAxios.get(`/orders/user/${userId}`),
  updateStatus:(id, s)   => orderAxios.patch(`/orders/${id}/status`, { status: s }),
};

export default OrderService;
