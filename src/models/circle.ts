import type { ChartPoint } from '../helpers/Point'
import { CirclePaneView } from '../paneView/circle'
import { PluginBase } from './base'

const defaultOption: CircleOption = {
  fillColor: 'black',
}

export class Circle extends PluginBase {
  center: ChartPoint
  radius: number
  option: CircleOption
  _paneViews: CirclePaneView[]

  constructor(center: ChartPoint, radius: number, option?: CircleOption) {
    super()
    this.center = center
    this.radius = radius
    this.option = option ?? defaultOption
    this._paneViews = [new CirclePaneView(this)]
  }

  paneViews() {
    return this._paneViews
  }

  updateAllViews() {
    this._paneViews.forEach(pw => pw.update())
  }
}

interface CircleOption {
  fillColor: string
}
