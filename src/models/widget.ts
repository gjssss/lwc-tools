import type { CirclePaneView } from '../paneView/circle'
import type { ChartToolContext } from '../types/tool'
import { PluginBase } from './base'

export abstract class WidgetBase extends PluginBase {
  protected abstract _paneViews: CirclePaneView[]
  chartContext: ChartToolContext

  constructor(context: ChartToolContext) {
    super()
    this.chartContext = context
  }

  paneViews() {
    return this._paneViews
  }

  updateAllViews() {
    this._paneViews.forEach(pw => pw.update())
  }
}
