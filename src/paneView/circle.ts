import type { ISeriesPrimitivePaneRenderer, ISeriesPrimitivePaneView } from 'lightweight-charts'
import type { Circle } from '../models/circle'
import { drawCircle } from '../render/circle'

export class CirclePaneView implements ISeriesPrimitivePaneView {
  source: Circle
  x?: number
  y?: number
  r?: number
  c?: string
  constructor(source: Circle) {
    this.source = source
  }

  update() {
    const p = this.source.pixelCenter
    this.x = p.x
    this.y = p.y
    this.r = this.source.radius
    this.c = this.source.option.fillColor
  }

  renderer(): ISeriesPrimitivePaneRenderer | null {
    if (this.x && this.y && this.r && this.c)
      return drawCircle(this.x, this.y, this.r, this.c)
    else return null
  }
}
