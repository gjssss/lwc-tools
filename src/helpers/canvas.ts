import type Victor from 'victor'

export function extendLine(p1: Victor, p2: Victor, canvasWidth: number, canvasHeight: number, extendP1: boolean, extendP2: boolean) {
  const direction = p2.clone().subtract(p1).normalize()
  const start = extendP1 ? getIntersectionWithCanvas(p1, direction.clone().invert(), canvasWidth, canvasHeight) : p1
  const end = extendP2 ? getIntersectionWithCanvas(p2, direction, canvasWidth, canvasHeight) : p2
  return { start, end }
}

export function getIntersectionWithCanvas(point: Victor, direction: Victor, canvasWidth: number, canvasHeight: number) {
  const tValues = []

  // Check intersections with canvas boundaries
  if (direction.x !== 0) {
    const t1 = -point.x / direction.x
    const t2 = (canvasWidth - point.x) / direction.x
    tValues.push(t1, t2)
  }
  if (direction.y !== 0) {
    const t3 = -point.y / direction.y
    const t4 = (canvasHeight - point.y) / direction.y
    tValues.push(t3, t4)
  }

  // Find the valid t value
  const validTValues = tValues.filter(t => t >= 0)
  const minT = Math.min(...validTValues)

  return point.clone().add(direction.clone().multiplyScalar(minT))
}
