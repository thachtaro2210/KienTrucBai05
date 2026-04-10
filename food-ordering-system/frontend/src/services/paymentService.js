import { paymentAxios } from '../config/axios';

const PaymentService = {
  process:  (data) => paymentAxios.post('/payments', data),
  getAll:   ()     => paymentAxios.get('/payments'),
};

export default PaymentService;
