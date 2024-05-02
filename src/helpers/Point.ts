import type { Time } from 'lightweight-charts'
import Point from 'victor'

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
 * 图表中的点，包括时间和价格
 */
export interface ChartPoint {
  time: Time
  price: number
}
