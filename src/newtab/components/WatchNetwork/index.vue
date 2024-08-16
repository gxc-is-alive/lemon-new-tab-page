<template>
  <el-card style="max-width: 480px" class="wrap">
    <template #header>
      <div class="card-header">
        <span>监视器</span>
        <el-icon
          @click="checkList"
          :class="{
            'is-loading': loadingFlag
          }"
        >
          <Refresh />
        </el-icon>
      </div>
    </template>
    <p v-for="item in watchList" :key="item.url" class="text-item">
      {{ item.name }}
      <span
        class="status-icon"
        :style="{
          background: SERVER_STATUS_COLOR_MAP[item.status]
        }"
      >
      </span>
    </p>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios'
import { Refresh } from '@element-plus/icons-vue'
import { useConstant } from '@/composables/useConstant'

const SERVICE_DEAD = 'SERVICE_DEAD'
const SERVICE_ALIVE = 'SERVICE_ALIVE'

type ServiceStatus = typeof SERVICE_DEAD | typeof SERVICE_ALIVE

interface WatchItem {
  name: string
  url: string
  status: ServiceStatus
}

const watchList: Ref<WatchItem[]> = ref([])
const loadingFlag: Ref<boolean> = ref(false)

const { SERVER_STATUS_COLOR_MAP } = useConstant()

const checkItem = async (item: WatchItem): Promise<void> => {
  if (!item.url) {
    return
  }
  try {
    await axios.get(item.url)
    item.status = 'SERVICE_ALIVE'
  } catch (error) {
    item.status = 'SERVICE_DEAD'
  }
}

const checkList = () => {
  loadingFlag.value = true
  watchList.value.forEach((item) => {
    checkItem(item)
  })
  setTimeout(() => {
    loadingFlag.value = false
  }, 500)
}

onMounted(() => {
  watchList.value = [
    {
      name: 'NAS',
      url: 'https://a.gxc1994.top:1994/help.html',
      status: 'SERVICE_DEAD'
    },
    {
      name: '梯子',
      url: 'https://github.com/',
      status: 'SERVICE_DEAD'
    }
  ]
  checkList()
  setInterval(() => {
    checkList()
  }, 60 * 1000)
})
</script>

<style lang="scss" scoped>
.wrap {
  width: 200px;
  height: auto;
  background: #fff;
  max-width: 80%;
  margin-top: 80px;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.65, 0.05, 0.1, 1);
  color: color-mix(in oklab, var(--el-text-color-primary), transparent 20%);
  background-color: color-mix(in oklab, var(--el-bg-color), transparent 80%);
  box-shadow: var(--el-box-shadow-dark);
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
  .text-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .status-icon {
      width: 10px;
      height: 10px;
      display: block;
      border-radius: 10px;
      margin-left: 30px;
    }
  }
}
</style>
