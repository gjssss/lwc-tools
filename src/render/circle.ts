import type { ISeriesPrimitivePaneRenderer } from 'lightweight-charts'

export function drawCircle(x: number, y: number, radius: number, fillColor: string): ISeriesPrimitivePaneRenderer {
  return {
    draw(target) {
      target.useMediaCoordinateSpace((scope) => {
        const ctx = scope.context
        ctx.fillStyle = fillColor
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI)
        ctx.fill()
      })
    },
  }
}
