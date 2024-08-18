<template>
  <div class="wrap">
    <el-progress
      :text-inside="true"
      :stroke-width="24"
      :percentage="usedPercentage"
      status="success"
      class="progress"
    />
    <div class="button-wrap">
      <el-button @click="handlePause"> {{ pauseFlag ? '继续' : '暂停' }} </el-button>
      <el-button @click="handleStartWork"> 工作 </el-button>
      <el-button @click="handleStartRest"> 休息 </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { SendNotification } from '@/composables/useNotification'

export default {
  setup() {
    let duration: number = 30 * 1000 * 60 // 30 分钟
    const remainingTime = ref<number>(duration)
    const isPaused = ref<boolean>(false)
    const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
    const startTime = ref<number | null>(null)
    const pauseFlag = ref<boolean>(false)
    const status = ref<'WORK' | 'REST'>('WORK')
    const calculateRemainingTime = (): number => {
      if (isPaused.value) {
        return remainingTime.value
      }
      if (startTime.value !== null) {
        return Math.max(0, duration - (Date.now() - startTime.value))
      }
      return duration
    }

    const start = () => {
      if (timeoutId.value) return // 已经启动
      startTime.value = Date.now()
      timeoutId.value = setTimeout(() => {
        SendNotification({
          message: `${status.value === 'WORK' ? '工作' : '休息'} 时间到`
        })
        reset()
      }, remainingTime.value)
      updateRemainingTime()
    }

    const pause = () => {
      if (isPaused.value || !timeoutId.value) return
      remainingTime.value = calculateRemainingTime()
      if (timeoutId.value) {
        clearTimeout(timeoutId.value)
        timeoutId.value = null
      }
      isPaused.value = true
    }

    const resume = () => {
      if (!isPaused.value) return
      isPaused.value = false
      startTime.value = Date.now() - (duration - remainingTime.value)
      timeoutId.value = setTimeout(() => {
        alert('时间到！')
        reset()
      }, remainingTime.value)
      updateRemainingTime()
    }

    const stop = () => {
      if (timeoutId.value) {
        clearTimeout(timeoutId.value)
        reset()
      }
    }

    const updateRemainingTime = () => {
      remainingTime.value = calculateRemainingTime()
      if (!isPaused.value && timeoutId.value) {
        setTimeout(updateRemainingTime, 1000) // 每秒更新一次
      }
    }

    const reset = () => {
      timeoutId.value = null
      isPaused.value = false
      startTime.value = null
      remainingTime.value = 0
      pauseFlag.value = false
    }

    const handleStartWork = () => {
      reset()
      status.value = 'WORK'
      duration = 60 * 1000 * 30
      remainingTime.value = duration
      start()
    }
    const handleStartRest = () => {
      reset()
      status.value = 'REST'
      duration = 1000*10
      remainingTime.value = duration
      start()
    }

    const handlePause = () => {
      if (pauseFlag.value) {
        resume()
      } else {
        pause()
      }
      pauseFlag.value = !pauseFlag.value
    }

    const usedPercentage = computed(() => {
      if (!remainingTime.value) return 0
      if (startTime.value === null) return 0
      const elapsedTime = Date.now() - startTime.value
      if (elapsedTime <= 0) return 0
      const percentage = Math.min(100, (elapsedTime / duration) * 100)
      return Number((100 - Number(percentage.toFixed(2))).toFixed(2)) // 保留两位小数
    })

    onUnmounted(() => {
      if (timeoutId.value) {
        clearTimeout(timeoutId.value)
      }
    })

    return {
      remainingTime: computed(() => remainingTime.value),
      usedPercentage,
      isPaused: computed(() => isPaused.value),
      start,
      pause,
      resume,
      stop,
      handleStartWork,
      handleStartRest,
      handlePause,
      pauseFlag
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  width: 100%;
  max-width: 80%;
  display: flex;
  .progress {
    width: 100%;
    margin-right: 20px;
  }
  .button-wrap {
    flex-shrink: 0;
  }
}
</style>