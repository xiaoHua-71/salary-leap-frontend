import request from '../utils/request'

// 获取薪资排行榜
export const getSalaryRanking = () => {
  return request.get('/rank')
}
