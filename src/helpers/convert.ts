import type { ISeriesApi, ITimeScaleApi, SeriesType, Time } from 'lightweight-charts'
import type { ChartPoint, Point } from './Point'
import { createPoint } from './Point'

/**
 * 将时间价格坐标转化为像素坐标
 */
export function convertChart2Point(timeScale: ITimeScaleApi<Time>, series: ISeriesApi<SeriesType>, chartPoint: ChartPoint) {
  const y = series.priceToCoordinate(chartPoint.price) as number
  const x = timeScale.timeToCoordinate(chartPoint.time) as number
  return createPoint(x, y)
}

/**
 * 将像素坐标转化为时间价格坐标
 */
export function convertPoint2Chart(timeScale: ITimeScaleApi<Time>, series: ISeriesApi<SeriesType>, point: Point): ChartPoint | null {
  const time = timeScale.coordinateToTime(point.x)
  const price = series.coordinateToPrice(point.y)
  if (time && price) {
    return {
      time,
      price,
    }
  }
  else {
    return null
  }
}
