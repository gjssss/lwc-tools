import type { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts'
import { Circle } from './models/circle'
import { useMouseHandler } from './share/mouse'

export function createChartTool(chart: IChartApi, series: ISeriesApi<SeriesType>) {
  const mouse = useMouseHandler()
  mouse.init(chart, series)

  let circleActive = false
  mouse.addMouseEventListener('mousedown', (_, event) => {
    if (circleActive)
      circleActive = false
    else
      return

    const price = event.getPrice()
    const time = event.getTime()
    if (price && time) {
      series.attachPrimitive(new Circle({
        price,
        time,
      }, 10))
    }
  })
  function activeDrawCircle() {
    circleActive = true
  }

  // const price = series.coordinateToPrice(100)!
  // const timeScale = chart.timeScale()
  // const time = timeScale.coordinateToTime(100)!
  // const circle = new Circle({
  //   price,
  //   time,
  // }, 10)
  // series.attachPrimitive(circle)
  // const ele = chart.chartElement()
  // const bound = ele.getBoundingClientRect()
  // ele.addEventListener('mousedown', (event) => {
  //   circle.center.time = timeScale.coordinateToTime(event.clientX - bound.x)!
  //   circle.center.price = series.coordinateToPrice(event.clientY - bound.y)!
  // })
  return {
    activeDrawCircle,
  }
}
