import type { ISeriesPrimitivePaneRenderer } from 'lightweight-charts'

export function drawLine(option: DrawLineOption): ISeriesPrimitivePaneRenderer {
  return {
    draw(target) {
      target.useMediaCoordinateSpace((scope) => {
        const ctx = scope.context
        ctx.beginPath()
        ctx.moveTo(option.x1, option.y1)
        ctx.lineTo(option.x2, option.y2)
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
}
