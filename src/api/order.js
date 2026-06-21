import { isUseCloud } from '@/config/cloud'
import { callCloud } from '@/untils/cloud'
import { orders as mockOrders } from '@/mock/dashboard'

export const createOrder = (data) => {
  if (!isUseCloud()) {
    return Promise.resolve({
      code: 0,
      data: { order: { ...data, id: Date.now() } },
    })
  }
  return callCloud('order_create', data)
}

export const fetchOrderList = () => {
  if (!isUseCloud()) {
    return Promise.resolve({
      code: 0,
      data: { list: mockOrders },
    })
  }
  return callCloud('order_list')
}
