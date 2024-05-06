import type { ISeriesPrimitivePaneRenderer } from 'lightweight-charts'
import { drawCircle } from '../render/circle'
import { createPoint } from '../helpers/Point'
import { DraggablePaneView } from './draggable'

export class CirclePaneView extends DraggablePaneView {
  protected x?: number
  protected y?: number
  protected r?: number
  protected fillColor?: string

  protected _hitTest(x: number, y: number): boolean {
    if (this.x && this.y && this.r) {
      const center = createPoint(this.x, this.y)
      const radius = this.r
      const dis = createPoint(x, y).distance(center)
      return dis <= radius
    }
    else {
      return false
    }
  }

  protected _renderer(): ISeriesPrimitivePaneRenderer | null {
    if (this.x && this.y && this.r && this.fillColor)
      return drawCircle(this.x, this.y, this.r, this.fillColor)
    else return null
  }

  public update(x: number, y: number, r: number, fillColor: string): void {
    this.x = x
    this.y = y
    this.r = r
    this.fillColor = fillColor
  }
}
