import type { ISeriesPrimitivePaneRenderer } from 'lightweight-charts'

export function drawCircle(option: DrawCircleOption): ISeriesPrimitivePaneRenderer {
  return {
    draw(target) {
      target.useMediaCoordinateSpace((scope) => {
        const ctx = scope.context
        ctx.beginPath()
        ctx.arc(option.x, option.y, option.radius, 0, 2 * Math.PI)
        if (option.fillColor) {
          ctx.fillStyle = option.fillColor
          ctx.fill()
        }
        if (option.strockColor && option.strockWidth) {
          ctx.lineWidth = option.strockWidth
          ctx.strokeStyle = option.strockColor
          ctx.stroke()
        }
      })
    },
  }
}

export interface DrawCircleOption {
  x: number
  y: number
  radius: number
  fillColor?: string
  strockWidth?: number
  strockColor?: string
}
