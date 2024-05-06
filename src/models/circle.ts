import { defu } from 'defu'
import type { ChartPoint, Point } from '../helpers/Point'
import { convertChart2Point } from '../helpers/convert'
import { CirclePaneView } from '../paneView/circle'
import type { ChartToolContext } from '../types/tool'
import { WidgetBase } from './widget'

const defaultOption: Partial<CircleOption> = {
  fillColor: 'black',
}

export class Circle extends WidgetBase {
  option: Required<CircleOption>

  constructor(context: ChartToolContext, option: CircleOption) {
    super(context)
    this.option = defu(option, defaultOption) as Required<CircleOption>
    this._paneViews.push(new CirclePaneView(this))
  }

  public get pixelCenter(): Point {
    return convertChart2Point(this.chart.timeScale(), this.series, this.option.center)
  }

  public get radius(): number {
    return this.pixelCenter.distance(convertChart2Point(this.chart.timeScale(), this.series, this.option.pos))
  }
}

interface CircleOption {
  fillColor?: string
  center: ChartPoint
  pos: ChartPoint
}
