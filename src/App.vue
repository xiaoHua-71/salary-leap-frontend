<template>
  <div id="app">
    <div class="app-content">
      <router-view />
    </div>
    <GlobalFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'
import GlobalFooter from './components/GlobalFooter.vue'

const userStore = useUserStore()

onMounted(async () => {
  // 应用启动时尝试获取当前用户信息
  await userStore.getCurrentUser()
})
</script>

<style>

:root {
  /* 古朴配色方案 */
  --primary-sand: #D2B48C;           /* 沙黄色主色 */
  --primary-brown: #8B7355;          /* 棕褐色主色 */
  --secondary-sand: #F5DEB3;         /* 浅沙色 */
  --secondary-brown: #A0522D;        /* 深棕色 */
  --accent-gold: #DAA520;            /* 金色强调 */
  --accent-copper: #B87333;          /* 铜色强调 */
  
  /* 中性色 */
  --text-primary: #3C2415;           /* 深棕色文字 */
  --text-secondary: #6B5B47;         /* 中棕色文字 */
  --text-muted: #8B7D6B;             /* 浅棕色文字 */
  --bg-primary: #FAF7F0;             /* 主背景色 */
  --bg-secondary: #F5F1E8;           /* 次背景色 */
  --bg-card: #FEFCF7;                /* 卡片背景 */
  
  /* 边框和阴影 */
  --border-light: #E8DCC6;           /* 浅色边框 */
  --border-medium: #D2B48C;          /* 中色边框 */
  --shadow-light: rgba(139, 115, 85, 0.1);
  --shadow-medium: rgba(139, 115, 85, 0.2);
  --shadow-heavy: rgba(139, 115, 85, 0.3);
}

/* Salary Leap brand palette */
:root {
  --primary-sand: #D9F3EE;
  --primary-brown: #0F766E;
  --secondary-sand: #ECFDF5;
  --secondary-brown: #115E59;
  --accent-gold: #F4B942;
  --accent-copper: #E07A3F;
  --text-primary: #102A43;
  --text-secondary: #486581;
  --text-muted: #829AB1;
  --bg-primary: #F5FAF9;
  --bg-secondary: #E8F3F1;
  --bg-card: #FFFFFF;
  --border-light: #CDE5E1;
  --border-medium: #8BC8C0;
  --shadow-light: rgba(15, 118, 110, 0.1);
  --shadow-medium: rgba(15, 118, 110, 0.2);
  --shadow-heavy: rgba(15, 118, 110, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.55;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.app-content {
  flex: 1;
}

/* 全局按钮样式 */
.el-button {
  border-radius: 8px !important;
  font-family: inherit !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
}

.el-button--primary {
  background: var(--primary-brown) !important;
  border: 1px solid var(--primary-brown) !important;
  box-shadow: 0 2px 6px var(--shadow-light) !important;
}

.el-button--primary:hover {
  background: var(--secondary-brown) !important;
  border-color: var(--secondary-brown) !important;
  transform: none !important;
  box-shadow: 0 4px 10px var(--shadow-medium) !important;
}

.el-button--default {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-medium) !important;
  color: var(--text-primary) !important;
}

.el-button--default:hover {
  background: var(--secondary-sand) !important;
  border-color: var(--primary-brown) !important;
  transform: none !important;
}

/* 全局卡片样式 */
.el-card {
  border: 1px solid var(--border-light) !important;
  border-radius: 10px !important;
  background: var(--bg-card) !important;
  box-shadow: 0 2px 10px var(--shadow-light) !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}

.el-card:hover {
  transform: none !important;
  box-shadow: 0 5px 16px var(--shadow-medium) !important;
  border-color: var(--border-medium) !important;
}

/* 全局标题样式 */
h1, h2, h3, h4, h5, h6 {
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 0;
}

/* Shared surface and form rhythm across every view. */
.el-input__wrapper,
.el-select__wrapper,
.el-textarea__inner,
.el-input-number {
  border-radius: 8px !important;
  box-shadow: 0 0 0 1px var(--border-light) inset !important;
}

.el-input__wrapper.is-focus,
.el-select__wrapper.is-focused,
.el-textarea__inner:focus {
  box-shadow: 0 0 0 1px var(--primary-brown) inset !important;
}

.el-table {
  --el-table-border-color: var(--border-light);
  --el-table-header-bg-color: var(--bg-secondary);
  --el-table-row-hover-bg-color: var(--secondary-sand);
  border-radius: 8px;
  overflow: hidden;
}

.el-dialog {
  border-radius: 12px !important;
}

/* Keep decorative treatments consistent with the restrained brand system. */
.feature-icon,
.header-icon {
  background: var(--primary-brown) !important;
  box-shadow: 0 4px 12px var(--shadow-light) !important;
}
.challenge-btn,
.login-button,
.register-button {
  background: var(--primary-brown) !important;
  border: 1px solid var(--primary-brown) !important;
  box-shadow: 0 3px 10px var(--shadow-light) !important;
}
.feature-card,
.ranking-column,
.history-item,
.score-card,
.generate-card,
.featured-levels-card {
  border-radius: 10px !important;
}
.ranking-column,
.ranking-item {
  box-shadow: 0 2px 8px var(--shadow-light) !important;
}

@media (max-width: 768px) {
  .el-button { min-height: 38px; }
}
</style>
