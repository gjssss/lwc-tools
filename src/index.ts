import type { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts'
import { Circle } from './models/circle'

export function createChartTool(chart: IChartApi, series: ISeriesApi<SeriesType>) {
  const price = series.coordinateToPrice(100)!
  const timeScale = chart.timeScale()
  const time = timeScale.coordinateToTime(100)!
  const circle = new Circle({
    price,
    time,
  }, 10)
  series.attachPrimitive(circle)
  const ele = chart.chartElement()
  const bound = ele.getBoundingClientRect()
  ele.addEventListener('mousedown', (event) => {
    circle.center.time = timeScale.coordinateToTime(event.clientX - bound.x)!
    circle.center.price = series.coordinateToPrice(event.clientY - bound.y)!
  })
  return {

  }
}
