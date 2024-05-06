import type { ISeriesApi, ITimeScaleApi, SeriesType, Time } from 'lightweight-charts'
import Point from 'victor'
import { convertChart2Point, convertPoint2Chart } from './convert'

export { Point }

export function scale(pos: Point, r: number) {
  pos.x *= r
  pos.y *= r
  return pos
}
export function createPoint(x: number, y: number) {
  return new Point(x, y)
}

export function distanceToLine(point0: Point, point1: Point, point2: Point) {
  const s = point1.subtract(point0)
  const l = point2.subtract(point0)
  const r = l.dot(s) / s.lengthSq()
  return { coeff: r, distance: l.subtract(scale(s, r)).length() }
}

/**
 * 将表格中的时间价格点尝试向`delta`方向像素移动，如果移动成功返回true
 * @param timeScale
 * @param series
 * @param chartPoint 时间价格点
 * @param delta 移动偏移量
 * @returns 是否成功移动
 */
export function tryToMove(timeScale: ITimeScaleApi<Time>, series: ISeriesApi<SeriesType>, chartPoint: ChartPoint, delta: Point) {
  const pos = convertChart2Point(timeScale, series, chartPoint)
  pos.add(delta)
  const newChartPoint = convertPoint2Chart(timeScale, series, pos)
  if (newChartPoint === null) {
    return false
  }
  else if (newChartPoint.price === chartPoint.price && newChartPoint.time === chartPoint.time) {
    return false
  }
  else {
    chartPoint.price = newChartPoint.price
    chartPoint.time = newChartPoint.time
    return true
  }
}

/**
 * 图表中的点，包括时间和价格
 */
export interface ChartPoint {
  time: Time
  price: number
}
