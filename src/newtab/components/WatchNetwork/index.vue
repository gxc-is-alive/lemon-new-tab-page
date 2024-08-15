<template>
  <div class="wrap">
    <div class="item" v-for="item in watchList" :key="item.name">
      {{ item.name }}
      {{ item.status }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios'

interface WatchItem {
  name: string
  url: string
  status: string
}

const watchList: Ref<WatchItem[]> = ref([
  {
    name: 'NAS',
    url: 'https://a.gxc1994.top:1994/help.html',
    status: ''
  }
])

const checkItem = async (item: WatchItem): Promise<void> => {
  if (!item.url) {
    return
  }
  try {
    await axios.get(item.url)
    item.status = 'TRUE'
  } catch (error) {
    item.status = 'FALSE'
  }
}

const checkList = () => {
  watchList.value.forEach((item) => {
    checkItem(item)
  })
}

onMounted(() => {
  checkList()
})
</script>

<style lang="scss" scoped></style>
