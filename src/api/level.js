import request from '../utils/request'

// 生成关卡
export const generateLevel = (salary = 10000) => {
  return request.post('/level/generate', null, { params: { salary } })
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
