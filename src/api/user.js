import request from '../utils/request'

// 用户注册
export const register = (data) => {
  return request.post('/user/register', data)
}

// 发送邮箱注册验证码
export const sendRegisterCode = (email) => {
  return request.post('/user/sendCode', { email })
}

// 用户登录
export const login = (data) => {
  return request.post('/user/login', data)
}

// 用户注销
export const logout = () => {
  return request.post('/user/logout')
}

// 获取当前登录用户
export const getCurrentUser = () => {
  return request.get('/user/current')
}

// 更新当前登录用户的个人资料
export const updateUser = (data) => {
  return request.post('/user/update', data)
}

// 修改当前登录用户的密码
export const updatePassword = (data) => {
  return request.post('/user/updatePassword', data)
}
