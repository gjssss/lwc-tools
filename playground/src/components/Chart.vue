<script setup lang="ts">
import { onMounted } from 'vue'
import { createChart } from 'lightweight-charts'
import { generateLineData } from '../sample-data'

onMounted(() => {
  const chart = createChart(document.getElementById('chart')!, {
    autoSize: true,
  })
  const lineSeries = chart.addLineSeries()
  const data = generateLineData()
  lineSeries.setData(data)
})
</script>

<template>
  <div id="chart" class="chart" />
</template>

<style>
.chart{
    width: 100%;
    height: 100%;
    border: 1px solid black;
    border-radius: 0.25rem;
    overflow: hidden;
}
</style>
