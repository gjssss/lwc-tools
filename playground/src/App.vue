<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import { createChart } from 'lightweight-charts'
import { CircleTool, LineTool, createChartTool } from '../../src'
import { generateLineData } from './sample-data'

const cb = shallowRef<Record<string, Function>>({})
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
      <button @click="cb?.activeCircle">
        Circle
      </button>
      <button @click="cb?.activeLine">
        Line
      </button>
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
}

.control-container{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;
  width: 10vw;
  padding: 1rem;
  height: 100vh;
  box-sizing: border-box;
}

.chart-container{
  width: 90vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 1rem;
}

#chart{
    width: 100%;
    height: 100%;
    border: 1px solid black;
    border-radius: 0.25rem;
    overflow: hidden;
}
</style>
