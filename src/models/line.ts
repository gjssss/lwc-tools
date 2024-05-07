import { defaults } from 'lodash-es'
import { type ChartPoint, type Point, tryToMove } from '../helpers/Point'
import { convertChart2Point } from '../helpers/convert'
import { LinePaneView } from '../paneView/line'
import type { ChartToolContext } from '../types/tool'
import { AnchoredPoint } from '../paneView/point'
import { WidgetBase } from './widget'

const defaultOption: Partial<LineOption> = {
  strockColor: 'red',
  strockWidth: 3,
}
export class Line extends WidgetBase {
  option: Required<LineOption>
  linePw: LinePaneView
  p1: AnchoredPoint
  p2: AnchoredPoint
  constructor(context: ChartToolContext, option: LineOption) {
    super(context)
    this.option = defaults(option, defaultOption) as Required<LineOption>
    this.linePw = new LinePaneView(this, {
      onDragging: (delta, _, success) => {
        const timeScale = this.chart.timeScale()
        if (
          tryToMove(timeScale, this.series, this.option.p1, delta)
          && tryToMove(timeScale, this.series, this.option.p2, delta)
        )
          success()
      },
      anchor: () => this.pixelP1,
    })
    this.p1 = new AnchoredPoint(this, {
      onDragging: (delta, _, success) => {
        const timeScale = this.chart.timeScale()
        if (
          tryToMove(timeScale, this.series, this.option.p1, delta)
        )
          success()
      },
      anchor: () => this.pixelP1,
    })
    this.p2 = new AnchoredPoint(this, {
      onDragging: (delta, _, success) => {
        const timeScale = this.chart.timeScale()
        if (
          tryToMove(timeScale, this.series, this.option.p2, delta)
        )
          success()
      },
      anchor: () => this.pixelP2,
    })
    this._paneViews.push(this.linePw, this.p1, this.p2)
  }

  public get pixelP1(): Point {
    return convertChart2Point(this.chart.timeScale(), this.series, this.option.p1)
  }

  public get pixelP2(): Point {
    return convertChart2Point(this.chart.timeScale(), this.series, this.option.p2)
  }

  updateAllViews(): void {
    const pixelP1 = this.pixelP1
    const pixelP2 = this.pixelP2
    this.linePw.update({
      x1: pixelP1.x,
      y1: pixelP1.y,
      x2: pixelP2.x,
      y2: pixelP2.y,
      strockColor: this.option.strockColor,
      strockWidth: this.option.strockWidth,
    })
    this.p1.update({
      x: pixelP1.x,
      y: pixelP1.y,
    })
    this.p2.update({
      x: pixelP2.x,
      y: pixelP2.y,
    })
    this.p1.isShow = this.isSelect
    this.p2.isShow = this.isSelect
  }
}

interface LineOption {
  p1: ChartPoint
  p2: ChartPoint
  strockColor?: string
  strockWidth?: number
}
