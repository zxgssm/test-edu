import request from '@/untils/request'

export const queryBossDashboard = (data) => {
  return request({
    url: '/merchant_api/v1/education/dashboard/boss',
    method: 'get',
    data,
  })
}

export const queryStaffDashboard = (data) => {
  return request({
    url: '/merchant_api/v1/education/dashboard/staff',
    method: 'get',
    data,
  })
}

export const createOrder = (data) => {
  return request({
    url: '/merchant_api/v1/education/orders',
    method: 'post',
    data,
  })
}
