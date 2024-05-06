import type { ISeriesPrimitivePaneRenderer, ISeriesPrimitivePaneView } from 'lightweight-charts'
import type { Circle } from '../models/circle'
import { drawCircle } from '../render/circle'
import { BasePaneView } from './base'

export class CirclePaneView extends BasePaneView<Circle> {
  protected _renderer(): ISeriesPrimitivePaneRenderer | null {
    const p = this.source.pixelCenter
    const r = this.source.radius
    const c = this.source.option.fillColor

    if (p.x && p.y && r && c)
      return drawCircle(p.x, p.y, r, c)
    else return null
  }
}
