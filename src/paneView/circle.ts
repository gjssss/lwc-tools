import type { ISeriesPrimitivePaneRenderer } from 'lightweight-charts'
import type { DrawCircleOption } from '../render/circle'
import { drawCircle } from '../render/circle'
import { createPoint } from '../helpers/Point'
import { DraggablePaneView } from './draggable'

export class CirclePaneView extends DraggablePaneView {
  protected option?: DrawCircleOption

  protected _hitTest(x: number, y: number): boolean {
    if (this.option && this.option.x && this.option.y && this.option.radius) {
      const center = createPoint(this.option.x, this.option.y)
      const radius = this.option.radius
      const dis = createPoint(x, y).distance(center)
      return dis <= radius
    }
    else {
      return false
    }
  }

  protected _renderer(): ISeriesPrimitivePaneRenderer | null {
    if (this.option && this.option.x && this.option.y && this.option?.radius)
      return drawCircle(this.option)
    else return null
  }

  public update(option: DrawCircleOption): void {
    this.option = option
  }
}
