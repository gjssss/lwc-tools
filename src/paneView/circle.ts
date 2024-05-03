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
    const p = this.source.pixelCenter
    this.x = p.x
    this.y = p.y
  }

  renderer(): ISeriesPrimitivePaneRenderer | null {
    if (this.x && this.y)
      return drawCircle(this.x, this.y, this.source.radius, this.source.option.fillColor)
    else return null
  }
}
