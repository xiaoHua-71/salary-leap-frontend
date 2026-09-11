<template>
  <div class="profile-container">
    <GlobalNavbar />

    <main class="profile-main">
      <section class="profile-hero">
        <div class="hero-icon"><el-icon><UserFilled /></el-icon></div>
        <div>
          <p class="eyebrow">ACCOUNT CENTER</p>
          <h1>个人设置</h1>
          <p>管理你的展示资料和学习方向。</p>
        </div>
      </section>

      <div class="profile-grid">
        <el-card class="settings-card profile-card" shadow="never">
          <template #header>
            <div class="card-title">
              <el-icon><EditPen /></el-icon>
              <div><h2>个人资料</h2><p>这些信息将展示在你的账户中</p></div>
            </div>
          </template>

          <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-position="top">
            <div class="avatar-preview">
              <el-avatar :src="profileForm.avatar" :size="72">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span>头像预览</span>
            </div>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="profileForm.nickname" :prefix-icon="User" placeholder="请输入昵称" size="large" />
            </el-form-item>
            <el-form-item label="头像 URL" prop="avatar">
              <el-input v-model="profileForm.avatar" :prefix-icon="Picture" placeholder="请输入头像图片链接" size="large" />
            </el-form-item>
            <el-form-item label="学习方向" prop="direction">
              <el-select v-model="profileForm.direction" class="full-width" size="large" @change="handleDirectionChange">
                <el-option v-for="direction in recommendedDirections" :key="direction" :label="direction" :value="direction" />
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="profileForm.direction === 'custom'" prop="customDirection">
              <el-input v-model="profileForm.customDirection" placeholder="请输入学习方向" size="large" />
            </el-form-item>
            <el-button class="save-button" type="primary" :loading="profileSaving" @click="saveProfile">
              <el-icon><Check /></el-icon> 保存个人资料
            </el-button>
          </el-form>
        </el-card>

        <el-card class="settings-card security-card" shadow="never">
          <template #header>
            <div class="card-title">
              <el-icon><Lock /></el-icon>
              <div><h2>账户安全</h2><p>单独修改密码，保护你的账户</p></div>
            </div>
          </template>

          <div class="security-note"><el-icon><InfoFilled /></el-icon><span>修改后无需重新登录，下次请使用新密码。</span></div>
          <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-position="top">
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" :prefix-icon="Key" type="password" show-password placeholder="请输入当前密码" size="large" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" :prefix-icon="Lock" type="password" show-password placeholder="至少 8 位" size="large" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPassword">
              <el-input v-model="passwordForm.checkPassword" :prefix-icon="Lock" type="password" show-password placeholder="请再次输入新密码" size="large" @keyup.enter="savePassword" />
            </el-form-item>
            <el-button class="password-button" :loading="passwordSaving" @click="savePassword">
              <el-icon><Key /></el-icon> 更新密码
            </el-button>
          </el-form>
        </el-card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, EditPen, InfoFilled, Key, Lock, Picture, User, UserFilled } from '@element-plus/icons-vue'
import GlobalNavbar from '../components/GlobalNavbar.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const user = computed(() => userStore.user)
const profileFormRef = ref()
const passwordFormRef = ref()
const profileSaving = ref(false)
const passwordSaving = ref(false)
const recommendedDirections = ['Java后端开发', '前端开发', 'Go开发', 'Agent开发']

const profileForm = reactive({ nickname: '', avatar: '', direction: '', customDirection: '' })
const passwordForm = reactive({ oldPassword: '', newPassword: '', checkPassword: '' })

const fillProfileForm = (currentUser) => {
  if (!currentUser) return
  profileForm.nickname = currentUser.nickname || ''
  profileForm.avatar = currentUser.avatar || ''
  profileForm.direction = recommendedDirections.includes(currentUser.direction) ? currentUser.direction : (currentUser.direction ? 'custom' : '')
  profileForm.customDirection = recommendedDirections.includes(currentUser.direction) ? '' : (currentUser.direction || '')
}

watch(user, fillProfileForm, { immediate: true })

const profileRules = {
  nickname: [{ max: 20, message: '昵称长度不能超过 20 个字符', trigger: 'blur' }],
  customDirection: [{ validator: (rule, value, callback) => profileForm.direction !== 'custom' || value.trim() ? callback() : callback(new Error('请输入学习方向')), trigger: 'blur' }]
}
const validateCheckPassword = (rule, value, callback) => value === passwordForm.newPassword ? callback() : callback(new Error('两次输入的新密码不一致'))
const passwordRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 8, message: '新密码至少 8 位', trigger: 'blur' }],
  checkPassword: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { validator: validateCheckPassword, trigger: 'blur' }]
}

const handleDirectionChange = (value) => { if (value !== 'custom') profileForm.customDirection = '' }

const saveProfile = async () => {
  await profileFormRef.value.validate()
  profileSaving.value = true
  try {
    const direction = profileForm.direction === 'custom' ? profileForm.customDirection.trim() : profileForm.direction
    await userStore.updateUser({ nickname: profileForm.nickname.trim(), avatar: profileForm.avatar.trim(), ...(direction ? { direction } : {}) })
    ElMessage.success('个人资料已更新')
  } catch (error) {
    console.error('更新个人资料失败:', error)
  } finally { profileSaving.value = false }
}

const savePassword = async () => {
  await passwordFormRef.value.validate()
  passwordSaving.value = true
  try {
    await userStore.updatePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword })
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.checkPassword = ''
    passwordFormRef.value.clearValidate()
    ElMessage.success('密码已更新')
  } catch (error) {
    console.error('修改密码失败:', error)
  } finally { passwordSaving.value = false }
}
</script>

<style scoped>
.profile-container { min-height: 100vh; background: var(--bg-secondary); }
.profile-main { max-width: 1080px; margin: 0 auto; padding: 52px 24px 72px; }
.profile-hero { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; color: var(--text-primary); }
.hero-icon { display: grid; place-items: center; width: 70px; height: 70px; color: var(--accent-gold); font-size: 34px; border-radius: 18px; background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown)); box-shadow: 0 8px 24px var(--shadow-medium); }
.eyebrow { margin: 0 0 6px; color: var(--accent-copper); font-size: 12px; font-weight: 700; letter-spacing: 1.6px; }
.profile-hero h1 { margin: 0; font-size: 30px; letter-spacing: 1px; }
.profile-hero > div:last-child > p:last-child { margin: 8px 0 0; color: var(--text-secondary); }
.profile-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; align-items: start; }
.settings-card { overflow: hidden; border: 1px solid var(--border-light); border-radius: 14px; background: var(--bg-card); box-shadow: 0 5px 20px var(--shadow-light); }
.settings-card :deep(.el-card__header) { padding: 22px 26px; border-bottom: 1px solid var(--border-light); }
.settings-card :deep(.el-card__body) { padding: 26px; }
.card-title { display: flex; align-items: center; gap: 12px; }
.card-title > .el-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 10px; color: var(--accent-gold); background: var(--primary-brown); font-size: 19px; }
.security-card .card-title > .el-icon { color: #fff; background: var(--accent-copper); }
.card-title h2 { margin: 0; color: var(--text-primary); font-size: 18px; }
.card-title p { margin: 4px 0 0; color: var(--text-secondary); font-size: 13px; }
.avatar-preview { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; padding: 12px; border-radius: 12px; color: var(--text-secondary); background: var(--bg-secondary); font-size: 14px; }
.full-width { width: 100%; }
.settings-card :deep(.el-form-item__label) { color: var(--text-primary); font-weight: 600; }
.settings-card :deep(.el-input__wrapper), .settings-card :deep(.el-select__wrapper) { min-height: 42px; border: 2px solid var(--border-light); border-radius: 10px; background: var(--bg-secondary); box-shadow: none; }
.settings-card :deep(.el-input__wrapper:hover), .settings-card :deep(.el-select__wrapper:hover) { border-color: var(--border-medium); }
.settings-card :deep(.el-input__wrapper.is-focus), .settings-card :deep(.el-select__wrapper.is-focused) { border-color: var(--primary-brown); box-shadow: 0 0 0 2px rgba(15, 118, 110, .16); }
.save-button, .password-button { width: 100%; height: 46px; border-radius: 10px; font-size: 16px; font-weight: 600; }
.save-button { border: 0; background: linear-gradient(135deg, var(--primary-brown), var(--secondary-brown)); }
.password-button { color: var(--primary-brown); border: 2px solid var(--accent-copper); background: transparent; }
.password-button:hover { color: #fff; border-color: var(--accent-copper); background: var(--accent-copper); }
.security-note { display: flex; gap: 8px; margin-bottom: 22px; padding: 12px; border: 1px solid rgba(218, 165, 32, .3); border-radius: 10px; color: var(--text-secondary); background: rgba(244, 185, 66, .1); font-size: 13px; line-height: 1.5; }
.security-note .el-icon { flex: none; margin-top: 2px; color: var(--accent-copper); }
@media (max-width: 768px) { .profile-main { padding: 32px 16px 48px; } .profile-grid { grid-template-columns: 1fr; } .profile-hero { align-items: flex-start; } .hero-icon { width: 56px; height: 56px; font-size: 27px; } .profile-hero h1 { font-size: 25px; } }
</style>
