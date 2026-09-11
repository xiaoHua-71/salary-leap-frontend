import request from '../utils/request'

// 根据当前登录用户的学习方向和薪资生成关卡
export const generateLevel = () => {
  return request.post('/level/generate')
}

// 获取关卡详情
export const getLevelDetail = (id) => {
  return request.get(`/level/${id}`)
}

// 获取人气关卡列表（无需登录）
export const getHotLevels = (limit = 10, direction) => {
  const params = { limit }
  if (direction) params.direction = direction
  return request.get('/level/hot', { params })
}
