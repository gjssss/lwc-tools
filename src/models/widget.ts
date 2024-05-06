import type { BasePaneView } from '../paneView/base'
import type { CirclePaneView } from '../paneView/circle'
import type { ChartToolContext } from '../types/tool'
import { PluginBase } from './base'

export abstract class WidgetBase extends PluginBase {
  isShow: boolean = true
  protected _paneViews: BasePaneView[] = []
  chartContext: ChartToolContext

  constructor(context: ChartToolContext) {
    super()
    this.chartContext = context
  }

  paneViews() {
    return this._paneViews
  }
}
