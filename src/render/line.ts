import Victor from 'victor'
import type { ISeriesPrimitivePaneRenderer } from 'lightweight-charts'
import { extendLine } from '../helpers/canvas'

export function drawLine(option: DrawLineOption): ISeriesPrimitivePaneRenderer {
  return {
    draw(target) {
      target.useMediaCoordinateSpace((scope) => {
        const ctx = scope.context
        const canvasWidth = scope.mediaSize.width
        const canvasHeight = scope.mediaSize.height

        const point1 = new Victor(option.x1, option.y1)
        const point2 = new Victor(option.x2, option.y2)

        // Extend the line to the canvas boundaries if required
        const extendedPoints = extendLine(point1, point2, canvasWidth, canvasHeight, option.extendP1, option.extendP2)

        ctx.beginPath()
        ctx.moveTo(extendedPoints.start.x, extendedPoints.start.y)
        ctx.lineTo(extendedPoints.end.x, extendedPoints.end.y)

        ctx.lineWidth = option.strockWidth
        ctx.strokeStyle = option.strockColor
        ctx.stroke()
      })
    },
  }
}

export interface DrawLineOption {
  x1: number
  y1: number
  x2: number
  y2: number
  strockWidth: number
  strockColor: string
  extendP1: boolean
  extendP2: boolean
}
