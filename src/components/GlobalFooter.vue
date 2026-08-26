<template>
  <footer class="footer-container">
    <div class="footer-content">
      <div class="footer-brand">
        <el-icon class="logo-icon" :size="34"><Trophy /></el-icon>
        <div>
          <strong>薪跃</strong>
          <p>技术成长挑战平台</p>
        </div>
      </div>
      <a class="github-link" href="https://github.com/xiaoHua-71/salary-leap-frontend" target="_blank" rel="noreferrer">
        <el-icon><Link /></el-icon>
        GitHub 源码
      </a>
    </div>
    <div class="copyright-footer">{{ currentYear }} 薪跃 · 技术成长挑战平台</div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { Link, Trophy } from '@element-plus/icons-vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer-container {
  background: #102A43;
  color: #D9F3EE;
  padding: 30px 24px 22px;
  border-top: 3px solid var(--accent-gold);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.footer-brand,
.github-link {
  display: flex;
  align-items: center;
}

.footer-brand {
  gap: 8px;
  flex-direction: column;
  text-align: center;
}
.logo-icon { color: var(--accent-gold); }

.footer-brand strong {
  display: block;
  color: #FFFFFF;
  font-size: 20px;
}

.footer-brand p {
  margin: 2px 0 0;
  color: #9FB3C8;
  font-size: 13px;
}

.github-link {
  gap: 8px;
  color: #FFFFFF;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.github-link:hover { color: var(--accent-gold); }

.copyright-footer {
  max-width: 1200px;
  margin: 24px auto 0;
  padding-top: 16px;
  border-top: 1px solid rgba(217, 243, 238, 0.18);
  color: #9FB3C8;
  font-size: 12px;
  text-align: center;
}
</style>
