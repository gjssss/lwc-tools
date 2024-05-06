import type { ISeriesPrimitivePaneRenderer, ISeriesPrimitivePaneView } from 'lightweight-charts'
import type { WidgetBase } from '../models/widget'

export abstract class BasePaneView<T extends WidgetBase = WidgetBase> implements ISeriesPrimitivePaneView {
  source: T
  isShow: boolean = true

  constructor(source: T) {
    this.source = source
  }

  protected abstract _renderer(): ISeriesPrimitivePaneRenderer | null
  renderer(): ISeriesPrimitivePaneRenderer | null {
    return this.isShow ? this._renderer() : null
  }
}
