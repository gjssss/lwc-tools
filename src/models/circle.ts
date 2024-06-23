import { defaults } from 'lodash-es'
import { type ChartPoint, type Point, tryToMove } from '../helpers/Point'
import { convertChart2Point } from '../helpers/convert'
import { CirclePaneView } from '../paneView/circle'
import type { ChartToolContext } from '../types/tool'
import { AnchoredPoint } from '../paneView/point'
import { WidgetBase } from './widget'

const defaultOption: Partial<CircleOption> = {
  fillColor: 'black',
}
export class Circle extends WidgetBase {
  type = 'Circle'

  option: Required<CircleOption>
  circlePw: CirclePaneView
  p1: AnchoredPoint
  p2: AnchoredPoint
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
    this.p1 = new AnchoredPoint(this, {
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
    this.p2 = new AnchoredPoint(this, {
      onDragging: (delta, _, success) => {
        const timeScale = this.chart.timeScale()
        if (
          tryToMove(timeScale, this.series, this.option.pos, delta)
        )
          success()
      },
      anchor: () => this.pixelPos,
    })
    this._paneViews.push(this.circlePw, this.p1, this.p2)
  }

  public get pixelCenter(): Point {
    return convertChart2Point(this.chart.timeScale(), this.series, this.option.center)
  }

  public get pixelPos(): Point {
    return convertChart2Point(this.chart.timeScale(), this.series, this.option.pos)
  }

  updateAllViews(): void {
    const pixelCenter = this.pixelCenter
    const pos = this.pixelPos
    const radius = pixelCenter.distance(this.pixelPos)
    this.circlePw.update({
      x: pixelCenter.x,
      y: pixelCenter.y,
      radius,
      fillColor: this.option.fillColor,
    })
    this.p1.update({
      x: pixelCenter.x,
      y: pixelCenter.y,
    })
    this.p2.update({
      x: pos.x,
      y: pos.y,
    })
    this.p1.isShow = this.isSelect
    this.p2.isShow = this.isSelect
  }
}

interface CircleOption {
  fillColor?: string
  center: ChartPoint
  pos: ChartPoint
}
