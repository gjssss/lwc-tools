import type { ChartPoint, Point } from '../helpers/Point'
import { disableChartScroll } from '../helpers/disableScroll'
import type { MouseEventObject } from '../helpers/mouse'
import type { WidgetBase } from '../models/widget'
import { BasePaneView } from './base'

export type OnDraggingFunction = (delta: Point, event: MouseEventObject, success: () => void) => void
export type AnchorPointGetter = () => Point
export interface DraggingOption {
  onDragging: OnDraggingFunction
  anchor?: AnchorPointGetter
}

export abstract class DraggablePaneView<T extends WidgetBase = WidgetBase> extends BasePaneView<T> {
  isDrag: boolean = false
  disableBgScroll: boolean = true
  private _lastMousePosition?: Point
  private _anchorDelta?: Point
  private enableFn?: Function

  onDragging: OnDraggingFunction
  private anchor?: AnchorPointGetter

  constructor(source: T, option: DraggingOption) {
    super(source)
    this.onDragging = option.onDragging
    this.anchor = option.anchor
  }

  override onMouseDown(_pos: Point, _event: MouseEventObject) {
    super.onMouseDown(_pos, _event)
    if (this.isHold && this.disableBgScroll)
      this.enableFn = disableChartScroll(this.source.chartContext.chart)
  }

  override onMouseUp(_pos: Point, _event: MouseEventObject) {
    super.onMouseUp(_pos, _event)
    if (this.enableFn) {
      this.enableFn()
      this.enableFn = undefined
    }
    this.isDrag = false
    this._lastMousePosition = undefined
  }

  override onMousePressedMove(_pos: Point, _event: MouseEventObject) {
    super.onMousePressedMove(_pos, _event)
    // 判断是否应该被拖动的逻辑
    // 当`isSelect`为false，表示未被选中时不应该被拖动。这个是防止拖动事件被高层的元件劫持
    // 当`isHover`为true时表示鼠标与元素进行碰撞，此时应该被拖动
    // `isDrag`的作用：在拖动的过程中，由于Canvas刷新的原因导致图形与鼠标会出现一定偏移，而偏移的时候`isHover`为false（因为没有碰撞）
    // 但此时拖动不应该终止，这个flag就是保证在拖动过程中持续进行。
    if ((this.isHover || this.isDrag) && this.source.isSelect) {
      // 表示事件被消耗，不应该传递给下层
      _event.isConsumed = true
      // 标记拖动
      if (this.isDrag === false)
        this.isDrag = true
      // 记录上次鼠标位置
      if (!this._lastMousePosition) {
        if (this.anchor)
          this._anchorDelta = _pos.clone().subtract(this.anchor())
        this._lastMousePosition = _pos.clone()
        return
      }
      const delta = _pos.clone().subtract(this._lastMousePosition)
      // 太小的抖动不会被拖动
      if (Math.abs(delta.x) < 0.01 && Math.abs(delta.y) < 0.01)
        return

      this.onDragging(delta, _event, () => {
        if (this.anchor)
          this._lastMousePosition = this.anchor().clone().add(this._anchorDelta!)
        else
          this._lastMousePosition = _pos.clone()
      })
    }
  }
}
