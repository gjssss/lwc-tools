import type { BasePaneView } from '../paneView/base'
import type { ChartToolContext } from '../types/tool'
import { PluginBase } from './base'

export abstract class WidgetBase extends PluginBase {
  /**
   * 是否被选中
   */
  isSelect: boolean = false
  /**
   * 是否显示
   */
  isShow: boolean = true
  /**
   * 是否创建结束
   */
  created: boolean = false

  protected _paneViews: BasePaneView[] = []
  chartContext: ChartToolContext

  constructor(context: ChartToolContext) {
    super()
    this.chartContext = context
  }

  paneViews() {
    return this._paneViews
  }

  toSelected = () => {
    this.chartContext.selectWidget?.toUnselected()
    this.isSelect = true
    this.chartContext.selectWidget = this
  }

  toUnselected = () => {
    this.isSelect = false
    this.chartContext.selectWidget = null
  }

  completeCreate() {
    this.created = true
  }
}
