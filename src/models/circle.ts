import { defaults } from 'lodash-es'
import { type ChartPoint, type Point, tryToMove } from '../helpers/Point'
import { convertChart2Point } from '../helpers/convert'
import { CirclePaneView } from '../paneView/circle'
import type { ChartToolContext } from '../types/tool'
import { WidgetBase } from './widget'

const defaultOption: Partial<CircleOption> = {
  fillColor: 'black',
}
export class Circle extends WidgetBase {
  option: Required<CircleOption>
  circlePw: CirclePaneView

  constructor(context: ChartToolContext, option: CircleOption) {
    super(context)
    this.option = defaults(option, defaultOption) as Required<CircleOption>
    this.circlePw = new CirclePaneView(this, {
      onDragging: (delta, _, success) => {
        const timeScale = this.chart.timeScale()
        if (
          tryToMove(timeScale, this.series, this.option.center, delta)
          && tryToMove(timeScale, this.series, this.option.pos, delta)
        )
          success()
      },
      anchor: () => this.pixelCenter,
    })
    this._paneViews.push(this.circlePw)
  }

  public get pixelCenter(): Point {
    return convertChart2Point(this.chart.timeScale(), this.series, this.option.center)
  }

  public get pixelPos(): Point {
    return convertChart2Point(this.chart.timeScale(), this.series, this.option.pos)
  }

  updateAllViews(): void {
    const pixelCenter = this.pixelCenter
    const radius = pixelCenter.distance(this.pixelPos)
    this.circlePw.update({
      x: pixelCenter.x,
      y: pixelCenter.y,
      radius,
    })
  }
}

interface CircleOption {
  fillColor?: string
  center: ChartPoint
  pos: ChartPoint
}
