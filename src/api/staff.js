import { isUseCloud } from '@/config/cloud'
import { callCloud } from '@/untils/cloud'
import { teachers } from '@/mock/dashboard'
import { mockCreateStaff } from '@/mock/auth'

const mapMockStaff = () => {
  return teachers.map((item, index) => ({
    id: `mock-${index}`,
    name: item.name,
    phone: item.phone || '',
    target: item.target,
    status: item.status === '在职' ? 'active' : 'pending_bind',
  }))
}

export const createStaffAccount = (data) => {
  if (!isUseCloud()) return mockCreateStaff(data)
  return callCloud('staff_create', data)
}

export const fetchStaffList = () => {
  if (!isUseCloud()) {
    return Promise.resolve({
      code: 0,
      data: { list: mapMockStaff() },
    })
  }
  return callCloud('staff_list')
}
