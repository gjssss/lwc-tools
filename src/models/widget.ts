import type { BasePaneView } from '../paneView/base'
import type { ChartToolContext } from '../types/tool'
import { PluginBase } from './base'

export abstract class WidgetBase extends PluginBase {
  abstract type: string
  abstract option: object
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
    if (this.chartContext.selectWidget === this)
      return
    this.chartContext.selectWidget?.toUnselected()
    this.isSelect = true
    this.chartContext.selectWidget = this
    this.chartContext.onSelect(this)
  }

  toUnselected = () => {
    this.isSelect = false
    if (this.chartContext.selectWidget) {
      this.chartContext.onSelect(undefined)
      this.chartContext.selectWidget = null
    }
  }

  completeCreate() {
    this.chartContext.widgets.push(this)
    this.created = true
  }

  public destroy() {
    // TODO: 可能有没有清除的地方，要检查一下
    const index = this.chartContext.widgets.findIndex(w => w === this)
    if (index === -1)
      return
    this.chartContext.widgets.splice(index, 1)
    this.toUnselected()
    this.series.detachPrimitive(this)
    this.detached()
    this._paneViews.forEach(item => item.distory())
    this.chartContext.update()
  }

  save() {
    return {
      type: this.type,
      option: this.option,
    }
  }
}
