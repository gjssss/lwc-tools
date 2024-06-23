<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { createChart } from 'lightweight-charts'
import { CircleTool, LineTool, createChartTool } from '../../src'
import { generateLineData } from './sample-data'
import './style.css'
import ToolInstaller from './components/toolInstaller.vue'
import ToolSetting from './components/toolSetting.vue'

const select = ref('tool')

const cb = shallowRef<Record<string, Function>>({})

const installOption = ref([
  {
    name: 'Circle',
    cb: () => {
      if (cb.value?.activeCircle)
        cb.value?.activeCircle()
    },
  },
  {
    name: 'Line',
    cb: () => {
      if (cb.value?.activeLine)
        cb.value?.activeLine()
    },
  },
])

onMounted(() => {
  const chart = createChart(document.getElementById('chart')!, {
    autoSize: true,
  })
  const lineSeries = chart.addLineSeries()
  const data = generateLineData()
  lineSeries.setData(data)
  const chartTool = createChartTool(chart, lineSeries)
  cb.value.activeCircle = chartTool.install(CircleTool)
  cb.value.activeLine = chartTool.install(LineTool)
})
</script>

<template>
  <div class="container">
    <div class="control-container">
      <div class="flex justify-around">
        <div @click="select = 'tool'">
          Tool
        </div>
        <div @click="select = 'setting'">
          Setting
        </div>
      </div>
      <div class="flex-1">
        <ToolInstaller v-if="select === 'tool'" :option="installOption" />
        <ToolSetting v-else>
          123
        </ToolSetting>
      </div>
    </div>
    <div class="chart-container">
      <div id="chart" />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
}

.control-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  position: absolute;
  left: 50px;
  top: 50px;
  z-index: 1000;
  background: #fff;
  border: 1px solid black;
  width: 300px;
  height: 500px;
}

.chart-container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 1rem;
}

#chart {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 0.25rem;
  overflow: hidden;
}
</style>
