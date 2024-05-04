import type { ChartPoint, Point } from '../helpers/Point'
import { convertChart2Point } from '../helpers/convert'
import { CirclePaneView } from '../paneView/circle'
import { PluginBase } from './base'

const defaultOption: CircleOption = {
  fillColor: 'black',
}

export class Circle extends PluginBase {
  center: ChartPoint
  pos: ChartPoint
  option: CircleOption
  _paneViews: CirclePaneView[]

  constructor(center: ChartPoint, pos: ChartPoint, option?: CircleOption) {
    super()
    this.center = center
    this.pos = pos
    this.option = option ?? defaultOption
    this._paneViews = [new CirclePaneView(this)]
  }

  public get pixelCenter(): Point {
    return convertChart2Point(this.chart.timeScale(), this.series, this.center)
  }

  public get radius(): number {
    return this.pixelCenter.distance(convertChart2Point(this.chart.timeScale(), this.series, this.pos))
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
