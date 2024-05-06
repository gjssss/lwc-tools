import type { IChartApi } from 'lightweight-charts'
import { cloneDeep } from 'lodash-es'

export function disableChartScroll(chart: IChartApi) {
  const options = chart.options()
  const scrollCtx = {
    handleScroll: cloneDeep(options.handleScroll),
    handleScale: cloneDeep(options.handleScale),
  }

  chart.applyOptions({
    handleScroll: false,
    handleScale: false,
  })

  function enableChartScroll() {
    chart.applyOptions(cloneDeep(scrollCtx))
  }

  return enableChartScroll
}
