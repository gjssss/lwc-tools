import type { ISeriesPrimitivePaneRenderer, ISeriesPrimitivePaneView } from 'lightweight-charts'
import type { Circle } from '../models/circle'
import { drawCircle } from '../render/circle'

export class CirclePaneView implements ISeriesPrimitivePaneView {
  source: Circle
  x?: number
  y?: number
  constructor(source: Circle) {
    this.source = source
  }

  update() {
    const series = this.source.series
    this.y = series.priceToCoordinate(this.source.center.price) as number
    const timeScale = this.source.chart.timeScale()
    this.x = timeScale.timeToCoordinate(this.source.center.time) as number
  }

  renderer(): ISeriesPrimitivePaneRenderer | null {
    if (this.x && this.y)
      return drawCircle(this.x, this.y, this.source.radius, this.source.option.fillColor)
    else return null
  }
}
