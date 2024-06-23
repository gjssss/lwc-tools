import type { ISeriesPrimitivePaneRenderer } from 'lightweight-charts'
import type { DrawLineOption } from '../render/line'
import { drawLine } from '../render/line'
import { createPoint, distanceToLine } from '../helpers/Point'
import { DraggablePaneView } from './draggable'

export class LinePaneView extends DraggablePaneView {
  protected option?: DrawLineOption

  protected _hitTest(x: number, y: number): boolean {
    if (this.option) {
      const start = createPoint(this.option.x1, this.option.y1)
      const end = createPoint(this.option.x2, this.option.y2)
      const { coeff, distance } = distanceToLine(start, end, createPoint(x, y))

      if (distance < this.option.strockWidth) {
        if (this.option.extendP1 && coeff <= 1)
          return true
        else if (this.option.extendP2 && coeff >= 0)
          return true
        else if (coeff >= 0 && coeff <= 1)
          return true
        return false
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }

  protected _renderer(): ISeriesPrimitivePaneRenderer | null {
    if (this.option)
      return drawLine(this.option)
    else return null
  }

  public update(option: DrawLineOption): void {
    this.option = option
  }
}
