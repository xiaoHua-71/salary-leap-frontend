import request from '../utils/request'

// 提交答案
export const submitAnswer = (data) => {
  return request.post('/level/submit', data)
}

// 获取闯关详情
export const getUserLevelDetail = (id) => {
  return request.get(`/user-level/${id}`)
}

// 获取闯关历史
export const getUserLevelHistory = () => {
  return request.get('/record/list')
}

// 获取答题记录统计概览
export const getRecordSummary = () => {
  return request.get('/record/summary')
}

// 获取答题记录列表（按作答时间倒序）
export const getRecordList = () => {
  return request.get('/record/list')
}
