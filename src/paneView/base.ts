import type { ISeriesPrimitivePaneRenderer, ISeriesPrimitivePaneView } from 'lightweight-charts'
import type { WidgetBase } from '../models/widget'
import type { Point } from '../helpers/Point'
import type { MouseEventObject } from '../helpers/mouse'

export abstract class BasePaneView<T extends WidgetBase = WidgetBase> implements ISeriesPrimitivePaneView {
  source: T
  isShow: boolean = true
  /**
   * 鼠标是否悬浮
   */
  isHover: boolean = false
  /**
   * 是否被鼠标按住
   */
  isHold: boolean = false

  constructor(source: T) {
    this.source = source

    const { mouse } = source.chartContext
    mouse.addMouseEventListener('mousemove', this.onMouseMove.bind(this))
    mouse.addMouseEventListener('mousedown', this.onMouseDown.bind(this))
    mouse.addMouseEventListener('mouseup', this.onMouseUp.bind(this))
    mouse.addMouseEventListener('mousePressedMove', this.onMousePressedMove.bind(this))
  }

  protected abstract _renderer(): ISeriesPrimitivePaneRenderer | null
  renderer(): ISeriesPrimitivePaneRenderer | null {
    return this.isShow ? this._renderer() : null
  }

  protected abstract _hitTest(x: number, y: number): boolean
  hitTest(x: number, y: number) {
    return this.isShow && this.source.created ? this._hitTest(x, y) : false
  }

  public abstract update(...params: any[]): void

  protected onMouseMove(_pos: Point, _event: MouseEventObject) {
    this.isHover = this.hitTest(_pos.x, _pos.y)

    if (this.isHover)
      this.source.toSelected()

    // else {
    //   console.log('notHover')
    //   if (!this.isHold) {
    //     console.log('toUnselected')
    //     this.source.toUnselected()
    //   }
    // }
  }

  protected onMouseDown(_pos: Point, _event: MouseEventObject) {
    if (this.isHover) {
      this.isHold = true
      _event.isConsumed = true
    }
  }

  protected onMouseUp(_pos: Point, _event: MouseEventObject) {
    this.isHold = false
    if (this.isHover) {
      this.source.toSelected()
      _event.isConsumed = true

      if (this.onClick)
        this.onClick()
    }
    else {
      this.source.toUnselected()
    }
  }

  protected onMousePressedMove(_pos: Point, _event: MouseEventObject) {

  }

  /**
   * 点击时回调
   */
  protected onClick?(): void
}
