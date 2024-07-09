<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { createChart } from 'lightweight-charts'
import { CircleTool, FabLineTool, LineTool, createChartTool } from '../../src'
import type { WidgetBase } from '../../src/models/widget'
import type { Line } from '../../src/models/line'
import { generateLineData } from './sample-data'
import './style.css'
import ToolInstaller from './components/toolInstaller.vue'
import ToolSetting from './components/toolSetting.vue'

const select = ref('tool')

const cb = shallowRef<Record<string, Function>>({})
const widget = shallowRef<WidgetBase>()
const chartTool = shallowRef()

const drawToolName = ref<string>()

const expendP1 = ref(false)
const expendP2 = ref(false)

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
  {
    name: 'FabLine',
    cb: () => {
      if (cb.value?.activeFabLine)
        cb.value?.activeFabLine()
    },
  },
])

function onSelect(w?: WidgetBase) {
  widget.value = w
  if (w && w.type === 'Line') {
    const lineWidget = w as Line
    expendP1.value = lineWidget.option.extendP1
    expendP2.value = lineWidget.option.extendP2
  }
}

function updateExpend(type: '1' | '2', value: boolean) {
  if (type === '1') {
    expendP1.value = value
    const lineWidget = widget.value as Line
    lineWidget.option.extendP1 = value
  }
  else {
    expendP2.value = value
    const lineWidget = widget.value as Line
    lineWidget.option.extendP2 = value
  }
  chartTool.value.update()
}

onMounted(() => {
  const chart = createChart(document.getElementById('chart')!, {
    autoSize: true,
  })
  const lineSeries = chart.addLineSeries()
  const data = generateLineData()
  lineSeries.setData(data)
  chartTool.value = createChartTool(chart, lineSeries, {
    onSelect,
    onDraw: name => drawToolName.value = name,
    onDrawOver: () => drawToolName.value = undefined,
  })
  cb.value.activeCircle = chartTool.value.install(CircleTool)
  cb.value.activeLine = chartTool.value.install(LineTool)
  cb.value.activeFabLine = chartTool.value.install(FabLineTool)
})

function saveHandle() {
  const data = chartTool.value ? chartTool.value.save() : []
  console.log(data)
  localStorage.setItem('data', data)
}
function loadHandle() {
  const data = localStorage.getItem('data') || []
  console.log(data)
  chartTool.value?.load(data)
}
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
        <template v-if="select === 'tool'">
          <div>
            {{ drawToolName ?? 'no tool drawing' }}
          </div>
          <ToolInstaller :option="installOption" />
        </template>
        <ToolSetting v-else>
          {{ widget?.type }}
          <button @click="widget?.destroy">
            delete
          </button>
          <button @click="saveHandle">
            save
          </button>
          <button @click="loadHandle">
            load
          </button>
          <div>
            ExpendP1
            <button @click="updateExpend('1', !expendP1)">
              {{ expendP1 }}
            </button>
            ExpendP2
            <button @click="updateExpend('2', !expendP2)">
              {{ expendP2 }}
            </button>
          </div>
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
