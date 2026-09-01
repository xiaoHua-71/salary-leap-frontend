<template>
  <div class="challenge-container">
    <!-- 全局导航栏 -->
    <GlobalNavbar />

    <div class="main-content">
      <!-- 生成关卡区域 -->
      <div v-if="!currentLevel" class="generate-section">
        <el-card class="generate-card">
          <div class="generate-content">
            <h2>准备开始新的挑战</h2>
            <p>系统将根据你当前的薪资水平，生成适合你的技术挑战</p>
            
            <el-button
              type="primary"
              size="large"
              :disabled="generating"
              @click="generateLevel"
            >
              <el-icon><MagicStick /></el-icon>
              生成关卡
            </el-button>
            
            <!-- 自定义加载区域 -->
            <div v-if="generating" class="custom-loading-area">
              <div class="binary-loader" role="status" aria-label="正在生成关卡">
                <div class="binary-stream" aria-hidden="true">
                  <span
                    v-for="(bit, index) in binaryBits"
                    :key="`generate-bit-${index}`"
                    :style="{ '--delay': `${index * 0.07}s` }"
                  >{{ bit }}</span>
                </div>
                <div class="binary-core" aria-hidden="true">
                  <span class="core-pixel pixel-one"></span>
                  <span class="core-pixel pixel-two"></span>
                  <span class="core-pixel pixel-three"></span>
                  <span class="core-pixel pixel-four"></span>
                </div>
                <div class="binary-label" aria-hidden="true">01 / BUILDING</div>
              </div>
              <div class="loading-text">正在生成关卡中...</div>
              <div class="progress-container">
                <el-progress 
                  :percentage="generateProgress" 
                  :stroke-width="6"
                  :show-text="false"
                  color="#DAA520"
                />
                <div class="progress-text">{{ generateProgress }}%</div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 人气关卡选择区域 -->
        <el-card class="featured-levels-card">
          <template #header>
            <div class="card-header">
              <h3>或选择人气关卡</h3>
              <el-icon class="star-icon"><Star /></el-icon>
            </div>
          </template>
          
          <div v-loading="featuredLoading" class="featured-content">
            <div v-if="featuredLevels.length === 0 && !featuredLoading" class="no-featured">
              <el-empty description="暂无人气关卡" />
            </div>
            
            <div v-else class="featured-grid">
              <div
                v-for="level in featuredLevels"
                :key="level.id"
                class="featured-item"
                @click="selectFeaturedLevel(level)"
              >
                <div class="featured-header">
                  <h4 class="featured-title">{{ level.levelName }}</h4>
                  <div class="featured-tags">
                    <el-tag 
                      v-if="level.direction" 
                      type="primary" 
                      size="small"
                    >
                      {{ level.direction }}
                    </el-tag>
                    <el-tag 
                      v-if="level.priority >= 9999" 
                      type="danger" 
                      size="small"
                    >
                      置顶
                    </el-tag>
                    <el-tag 
                      v-else-if="level.priority >= 999" 
                      type="warning" 
                      size="small"
                    >
                      精选
                    </el-tag>
                    <el-tag 
                      :type="getDifficultyType(level.difficulty)" 
                      size="small"
                    >
                      {{ level.difficulty }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="featured-desc">
                  {{ truncateText(level.levelDesc, 80) }}
                </div>
                
                <div class="featured-meta">
                  <span class="target-salary">
                    ¥{{ level.targetSalary?.toLocaleString() || 0 }}/月
                  </span>
                  <span class="play-count">
                    {{ level.playCount || 0 }} 人已作答
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 关卡内容区域 -->
      <div v-if="currentLevel" class="level-section">
        <!-- 关卡信息 -->
        <el-card class="level-info-card">
          <div class="level-header">
            <h2 class="level-name">{{ currentLevel.levelName }}</h2>
            <div class="level-meta">
              <el-tag 
                v-if="currentLevel.direction" 
                type="primary" 
                size="large"
              >
                {{ currentLevel.direction }}
              </el-tag>
              <el-tag :type="getDifficultyType(currentLevel.difficulty)">
                {{ currentLevel.difficulty }}
              </el-tag>
              <span class="target-salary">
                目标薪资：¥{{ currentLevel.targetSalary?.toLocaleString() || 0 }}/月
              </span>
            </div>
          </div>
          
          <div class="level-desc">
            <h3>需求描述：</h3>
            <div class="desc-content" v-html="formatDescription(currentLevel.levelDesc)"></div>
          </div>
        </el-card>

        <!-- 答题区域 -->
        <div class="answer-section">
          <div class="options-area">
            <h3>可选项（拖拽到右侧答题区）</h3>
            <div class="options-grid">
              <div
                v-for="option in availableOptions"
                :key="option"
                class="option-item"
                :class="{ 'selected': selectedOptions.includes(option) }"
                draggable="true"
                @dragstart="handleDragStart($event, option)"
                @click="toggleOption(option)"
              >
                {{ option }}
              </div>
            </div>
          </div>

          <div class="answer-area">
            <h3>你的答案</h3>
            <div
              class="answer-box"
              @drop="handleDrop"
              @dragover="handleDragOver"
              @dragenter="handleDragEnter"
              @dragleave="handleDragLeave"
            >
              <div v-if="selectedOptions.length === 0" class="answer-placeholder">
                将选项拖拽到这里，或者点击左侧选项添加到答案中
              </div>
              
              <div
                v-for="(optionName, index) in selectedOptions"
                :key="index"
                class="selected-option"
              >
                {{ optionName }}
                <el-button
                  type="danger"
                  size="small"
                  :icon="Close"
                  circle
                  @click="removeOption(optionName)"
                />
              </div>
            </div>

            <div class="submit-area">
              <div class="button-row">
                <el-button
                  type="primary"
                  size="large"
                  :disabled="submitting || selectedOptions.length === 0"
                  @click="submitAnswer"
                >
                  <el-icon><Check /></el-icon>
                  提交答案
                </el-button>
                
                <el-button
                  size="large"
                  :disabled="submitting"
                  @click="resetLevel"
                >
                  <el-icon><Refresh /></el-icon>
                  重新生成
                </el-button>
              </div>
              
              <!-- 提交答案加载区域 -->
              <div v-if="submitting" class="custom-loading-area submit-loading">
                <div class="binary-loader" role="status" aria-label="正在提交答案">
                  <div class="binary-stream" aria-hidden="true">
                    <span
                      v-for="(bit, index) in binaryBits"
                      :key="`submit-bit-${index}`"
                      :style="{ '--delay': `${index * 0.07}s` }"
                    >{{ bit }}</span>
                  </div>
                  <div class="binary-core" aria-hidden="true">
                    <span class="core-pixel pixel-one"></span>
                    <span class="core-pixel pixel-two"></span>
                    <span class="core-pixel pixel-three"></span>
                    <span class="core-pixel pixel-four"></span>
                  </div>
                  <div class="binary-label" aria-hidden="true">01 / CHECKING</div>
                </div>
                <div class="loading-text">正在提交答案...</div>
                <div class="progress-container">
                  <el-progress 
                    :percentage="submitProgress" 
                    :stroke-width="6"
                    :show-text="false"
                    color="#DAA520"
                  />
                  <div class="progress-text">{{ submitProgress }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { generateLevel as generateLevelAPI, getHotLevels, getLevelDetail } from '../api/level'
import { submitAnswer as submitAnswerAPI } from '../api/userLevel'
import { ElMessage } from 'element-plus'
import {
  MagicStick,
  Check,
  Refresh,
  Close,
  Star
} from '@element-plus/icons-vue'
import GlobalNavbar from '../components/GlobalNavbar.vue'

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const generating = ref(false)
const submitting = ref(false)
const currentLevel = ref(null)
const selectedOptions = ref([])
const draggedOption = ref(null)

// 人气关卡相关数据
const featuredLevels = ref([])
const featuredLoading = ref(false)

// 进度条相关
const generateProgress = ref(0)
const submitProgress = ref(0)
let generateProgressInterval = null
let submitProgressInterval = null

const binaryBits = '01101001011011100110100101110100'.split('')

// 进度条模拟逻辑
const simulateProgress = (progressRef, type = 'generate') => {
  progressRef.value = 0
  let currentProgress = 0
  
  return setInterval(() => {
    if (currentProgress < 30) {
      // 前30%：快速增长（模拟初始化）
      currentProgress += Math.random() * 8 + 3
    } else if (currentProgress < 60) {
      // 30%-60%：中等速度（模拟处理中）
      currentProgress += Math.random() * 4 + 2
    } else if (currentProgress < 85) {
      // 60%-85%：较慢速度（模拟深度处理）
      currentProgress += Math.random() * 2 + 1
    } else if (currentProgress < 99) {
      // 85%-99%：很慢速度（模拟最终处理）
      currentProgress += Math.random() * 0.5 + 0.2
    }
    
    // 确保不超过99%，最后1%由实际完成时设置
    progressRef.value = Math.min(Math.floor(currentProgress), 99)
  }, type === 'generate' ? 300 : 200) // 生成关卡稍慢，提交答案稍快
}

const stopProgress = (intervalRef) => {
  if (intervalRef) {
    clearInterval(intervalRef)
  }
}

const completeProgress = (progressRef) => {
  progressRef.value = 100
}

// 计算可用选项（排除已选择的）
const availableOptions = computed(() => {
  if (!currentLevel.value?.options) return []
  
  try {
    const options = typeof currentLevel.value.options === 'string' 
      ? JSON.parse(currentLevel.value.options) 
      : currentLevel.value.options
    return (options || [])
      .map(option => typeof option === 'string' ? option : option?.optionName)
      .filter(Boolean)
  } catch (error) {
    console.error('解析选项失败:', error)
    return []
  }
})


const getDifficultyType = (difficulty) => {
  switch (difficulty) {
    case '简单': return 'success'
    case '中等': return 'warning'
    case '困难': return 'danger'
    default: return 'info'
  }
}

const formatDescription = (desc) => {
  if (!desc) return ''
  // 将换行符转换为 <br> 标签，保持原有格式
  return desc.replace(/\n/g, '<br>')
}

// 生成关卡
const generateLevel = async () => {
  console.log('用户信息:', user.value)
  console.log('用户薪资:', user.value?.salary)
  
  if (!user.value) {
    ElMessage.error('用户未登录，请先登录')
    router.push('/login')
    return
  }
  
  // 如果用户没有薪资信息，设置默认薪资为 5000
  const userSalary = user.value.salary || 5000
  console.log('使用的薪资:', userSalary)

  generating.value = true
  // 启动进度条模拟
  generateProgressInterval = simulateProgress(generateProgress, 'generate')
  
  try {
    const levelData = await generateLevelAPI(userSalary)
    currentLevel.value = levelData
    selectedOptions.value = []
    
    // 完成进度条
    completeProgress(generateProgress)
    
    // 短暂延迟后显示成功消息，让用户看到100%
    setTimeout(() => {
      ElMessage.success('关卡生成成功！')
    }, 200)
  } catch (error) {
    console.error('生成关卡失败:', error)
    ElMessage.error('生成关卡失败，请重试')
  } finally {
    // 清理进度条定时器
    stopProgress(generateProgressInterval)
    generateProgressInterval = null
    
    // 延迟重置状态，让用户看到完成效果
    setTimeout(() => {
      generating.value = false
      generateProgress.value = 0
    }, 500)
  }
}

// 拖拽开始
const handleDragStart = (event, option) => {
  draggedOption.value = option
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', typeof option === 'string' ? option : option.optionName)
}

// 拖拽悬停
const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const handleDragEnter = (event) => {
  event.preventDefault()
  event.target.closest('.answer-box')?.classList.add('drag-over')
}

const handleDragLeave = (event) => {
  event.preventDefault()
  if (!event.target.closest('.answer-box')?.contains(event.relatedTarget)) {
    event.target.closest('.answer-box')?.classList.remove('drag-over')
  }
}

// 拖拽放下
const handleDrop = (event) => {
  event.preventDefault()
  event.target.closest('.answer-box')?.classList.remove('drag-over')
  
  if (draggedOption.value) {
    toggleOption(draggedOption.value)
    draggedOption.value = null
  }
}

// 切换选项（添加或移除）
const toggleOption = (option) => {
  const optionName = typeof option === 'string' ? option : option.optionName
  const index = selectedOptions.value.indexOf(optionName)
  
  if (index > -1) {
    selectedOptions.value.splice(index, 1)
  } else {
    selectedOptions.value.push(optionName)
  }
}

// 移除选项
const removeOption = (optionName) => {
  const index = selectedOptions.value.indexOf(optionName)
  if (index > -1) {
    selectedOptions.value.splice(index, 1)
  }
}

// 提交答案
const submitAnswer = async () => {
  if (selectedOptions.value.length === 0) {
    ElMessage.warning('请至少选择一个选项')
    return
  }

  submitting.value = true
  // 启动进度条模拟
  submitProgressInterval = simulateProgress(submitProgress, 'submit')
  
  try {
    const submitData = {
      levelId: currentLevel.value.id,
      userOptions: selectedOptions.value
    }
    
    const result = await submitAnswerAPI(submitData)
    console.log('提交答案结果:', result)
    
    // 更新用户薪资
    if (typeof result.newSalary === 'number') {
      userStore.updateUserSalary(result.newSalary)
    } else if (result.salaryChange) {
      userStore.updateUserSalary(user.value.salary + result.salaryChange)
    }
    
    // 完成进度条
    completeProgress(submitProgress)
    
    // 短暂延迟后跳转，让用户看到100%
    setTimeout(() => {
      sessionStorage.setItem('latestLevelReport', JSON.stringify(result))
      router.push(`/result/${result.levelId || currentLevel.value.id}`)
    }, 300)
    
  } catch (error) {
    console.error('提交答案失败:', error)
    ElMessage.error('提交答案失败，请重试')
    
    // 清理进度条定时器
    stopProgress(submitProgressInterval)
    submitProgressInterval = null
    
    // 重置状态
    setTimeout(() => {
      submitting.value = false
      submitProgress.value = 0
    }, 300)
  }
}

// 重置关卡
const resetLevel = () => {
  currentLevel.value = null
  selectedOptions.value = []
}

// 加载人气关卡列表
const loadFeaturedLevels = async () => {
  featuredLoading.value = true
  try {
    featuredLevels.value = await getHotLevels(10)
  } catch (error) {
    console.error('获取人气关卡失败:', error)
    ElMessage.error('获取人气关卡失败')
  } finally {
    featuredLoading.value = false
  }
}

// 选择人气关卡后获取完整题目，选项不在列表接口中返回。
const selectFeaturedLevel = async (level) => {
  featuredLoading.value = true
  try {
    currentLevel.value = await getLevelDetail(level.id)
    selectedOptions.value = []
    ElMessage.success(`已选择关卡：${currentLevel.value.levelName}`)
  } catch (error) {
    console.error('获取关卡详情失败:', error)
    ElMessage.error('获取关卡详情失败')
  } finally {
    featuredLoading.value = false
  }
}

// 文本截断
const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 监听加载状态，确保进度模拟定时器及时清理
watch(generating, (newVal) => {
  if (!newVal && generateProgressInterval) {
    stopProgress(generateProgressInterval)
    generateProgressInterval = null
  }
})

watch(submitting, (newVal) => {
  if (!newVal && submitProgressInterval) {
    stopProgress(submitProgressInterval)
    submitProgressInterval = null
  }
})

onMounted(() => {
  // 页面加载时检查用户登录状态
  if (!user.value) {
    router.push('/login')
  } else {
    // 加载人气关卡列表
    loadFeaturedLevels()
  }
})

onUnmounted(() => {
  // 组件销毁时清理所有定时器
  stopProgress(generateProgressInterval)
  stopProgress(submitProgressInterval)
})
</script>

<style scoped>
.challenge-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(210, 180, 140, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 115, 85, 0.1) 0%, transparent 50%);
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 30px;
}

.generate-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  min-height: 400px;
}

.generate-card {
  max-width: 500px;
  width: 100%;
}

.featured-levels-card {
  width: 100%;
  max-width: 1200px;
  box-shadow: 0 8px 32px var(--shadow-heavy);
  border-radius: 20px;
  border: 1px solid var(--border-light);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  margin: 0;
  color: var(--primary-brown);
  font-size: 20px;
  font-weight: 600;
}

.star-icon {
  font-size: 24px;
  color: var(--accent-gold);
}

.featured-content {
  min-height: 200px;
}

.no-featured {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.featured-item {
  background: var(--bg-card);
  border: 2px solid var(--border-light);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.featured-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-gold) 0%, var(--accent-copper) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-item:hover {
  border-color: var(--accent-gold);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--shadow-medium);
}

.featured-item:hover::before {
  opacity: 1;
}

.featured-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 10px;
}

.featured-title {
  margin: 0;
  color: var(--primary-brown);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  flex: 1;
}

.featured-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.featured-desc {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  min-height: 42px;
}

.featured-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-muted);
}

.target-salary {
  color: var(--accent-gold);
  font-weight: 600;
}

.create-time {
  color: var(--text-muted);
}

.featured-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.generate-content {
  text-align: center;
  padding: 40px 20px;
}

.generate-content h2 {
  margin-bottom: 20px;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

.generate-content p {
  margin-bottom: 35px;
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 16px;
}

.direction-selector {
  margin-bottom: 30px;
}

.direction-selector h3 {
  margin-bottom: 15px;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.level-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.level-info-card {
  width: 100%;
}

.level-header {
  margin-bottom: 20px;
}

.level-name {
  color: var(--text-primary);
  margin-bottom: 12px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

.level-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.target-salary {
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 600;
}

.level-desc h3 {
  color: var(--text-primary);
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.desc-content {
  color: var(--text-secondary);
  line-height: 1.8;
  background: var(--bg-secondary);
  padding: 25px;
  border-radius: 12px;
  border-left: 4px solid var(--accent-gold);
  border: 2px solid var(--border-light);
  font-size: 15px;
}

.answer-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.options-area h3,
.answer-area h3 {
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.option-item {
  background: var(--bg-card);
  border: 2px solid var(--border-light);
  border-radius: 12px;
  padding: 18px 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  color: var(--text-primary);
  font-weight: 500;
}

.option-item:hover {
  border-color: var(--primary-brown);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.option-item.selected {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-copper) 100%);
  border-color: var(--accent-gold);
  color: var(--text-primary);
  font-weight: 600;
}

.answer-box {
  min-height: 220px;
  border: 2px dashed var(--border-medium);
  border-radius: 12px;
  padding: 25px;
  background: var(--bg-card);
  transition: all 0.3s ease;
}

.answer-box.drag-over {
  border-color: var(--accent-gold);
  background: var(--secondary-sand);
  border-style: solid;
}

.answer-placeholder {
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  padding: 70px 20px;
  font-size: 15px;
}

.selected-option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--primary-brown) 0%, var(--secondary-brown) 100%);
  color: var(--bg-card);
  padding: 10px 18px;
  border-radius: 25px;
  margin: 6px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px var(--shadow-medium);
}

.submit-area {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.submit-area .button-row {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 10px;
}

/* 自定义加载区域 */
.custom-loading-area {
  position: relative;
  width: 300px;
  height: 180px;
  margin: 20px auto;
  border: 2px dashed var(--border-medium);
  border-radius: 12px;
  background: var(--bg-secondary);
  overflow: hidden;
}

.binary-loader {
  position: absolute;
  inset: 14px 18px 54px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--primary-brown);
  font-family: 'Courier New', monospace;
  overflow: hidden;
}

.binary-stream {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 7px;
  color: #6aa59d;
  font-size: 13px;
  letter-spacing: 1px;
  white-space: nowrap;
}

.binary-stream span {
  animation: binary-pulse 1.2s ease-in-out infinite;
  animation-delay: var(--delay);
}

.binary-core {
  position: relative;
  width: 58px;
  height: 42px;
  border: 2px solid var(--accent-gold);
  background: rgba(255, 255, 255, 0.58);
  box-shadow: 0 0 0 5px rgba(244, 185, 66, 0.12), 0 5px 16px rgba(28, 91, 93, 0.12);
  animation: core-scan 1.6s ease-in-out infinite;
}

.core-pixel {
  position: absolute;
  width: 9px;
  height: 9px;
  background: var(--primary-brown);
  animation: pixel-blink 1.4s steps(2, end) infinite;
}

.pixel-one { top: 8px; left: 10px; }
.pixel-two { top: 8px; right: 10px; animation-delay: 0.2s; }
.pixel-three { bottom: 8px; left: 20px; animation-delay: 0.4s; }
.pixel-four { bottom: 8px; right: 20px; animation-delay: 0.6s; }

.binary-label {
  color: var(--text-secondary);
  font-size: 11px;
  letter-spacing: 1.5px;
  opacity: 0.8;
}

@keyframes binary-pulse {
  0%, 100% { opacity: 0.25; transform: translateY(3px); }
  50% { opacity: 1; color: var(--accent-copper); transform: translateY(-2px); }
}

@keyframes core-scan {
  0%, 100% { transform: translateY(3px); opacity: 0.72; }
  50% { transform: translateY(-3px); opacity: 1; }
}

@keyframes pixel-blink {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}

.loading-text {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  z-index: 3;
  background: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: 4px;
}

/* 进度条容器 */
.progress-container {
  position: absolute;
  bottom: 8px;
  left: 20px;
  right: 20px;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-container .el-progress {
  flex: 1;
}

.progress-text {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.submit-loading {
  margin-top: 15px;
}

/* 与首页“薪跃特色”保持一致的关卡视觉 */
.challenge-container {
  background: #f3f9f8;
}

.main-content {
  max-width: 1180px;
  padding: 56px 30px 80px;
}

.generate-section {
  gap: 36px;
}

.generate-card,
.featured-levels-card,
.level-info-card {
  border: 3px solid #cce7e3 !important;
  border-radius: 14px !important;
  background: #fff !important;
  box-shadow: 0 14px 34px rgba(28, 91, 93, 0.12) !important;
}

.generate-card {
  max-width: 760px;
}

.generate-card:hover,
.featured-levels-card:hover,
.level-info-card:hover {
  border-color: #e7bf55 !important;
  box-shadow: 0 18px 40px rgba(28, 91, 93, 0.16) !important;
}

.generate-content {
  padding: 48px 34px;
}

.generate-content h2,
.level-name,
.options-area h3,
.answer-area h3 {
  color: #17324d;
}

.generate-content p,
.desc-content,
.featured-desc {
  color: #557493;
}

.generate-content .el-button,
.submit-area .el-button--primary {
  background: #117f78 !important;
  border-color: #117f78 !important;
  border-radius: 8px !important;
  box-shadow: 0 8px 18px rgba(17, 127, 120, 0.24);
}

.generate-content .el-button:hover,
.submit-area .el-button--primary:hover {
  background: #0c6b65 !important;
  border-color: #0c6b65 !important;
}

.featured-item,
.option-item,
.answer-box {
  border-color: #cce7e3;
  border-radius: 10px;
}

.featured-item:hover,
.option-item:hover {
  border-color: #e7bf55;
  box-shadow: 0 10px 24px rgba(28, 91, 93, 0.14);
}

.option-item.selected {
  background: #117f78;
  border-color: #117f78;
  color: #fff;
}

.desc-content {
  background: #f7fbfa;
  border-left: 4px solid #e7bf55;
}

.selected-option {
  background: #17324d;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 30px 20px;
  }
  
  .answer-section {
    grid-template-columns: 1fr;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .submit-area .button-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .custom-loading-area {
    width: 250px;
    height: 150px;
  }
  
  .progress-container {
    left: 15px;
    right: 15px;
    gap: 8px;
  }
  
  .progress-text {
    font-size: 11px;
    min-width: 28px;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .featured-item {
    padding: 15px;
  }
  
  .featured-title {
    font-size: 15px;
  }
  
  .featured-desc {
    font-size: 13px;
    min-height: 36px;
  }
}
</style>
