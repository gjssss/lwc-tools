import { type ChartPoint, type Point, tryToMove } from '../helpers/Point'
import { convertChart2Point } from '../helpers/convert'
import { LinePaneView } from '../paneView/line'
import type { ChartToolContext } from '../types/tool'
import { AnchoredPoint } from '../paneView/point'
import { WidgetBase } from './widget'

export class FabLine extends WidgetBase {
  type = 'FabLine'

  option: FabLineOption
  linesPw: LinePaneView[]
  p1: AnchoredPoint
  p2: AnchoredPoint
  constructor(context: ChartToolContext, option: FabLineOption) {
    super(context)
    this.option = option
    this.linesPw = []
    // 第一条 0 线
    this.linesPw.push(new LinePaneView(this, {
      onDragging: (delta, _, success) => {
        const timeScale = this.chart.timeScale()
        if (
          tryToMove(timeScale, this.series, this.option.p1, delta)
          && tryToMove(timeScale, this.series, this.option.p2, delta)
        )
          success()
      },
      anchor: () => this.pixelP1,
    }))
    // 剩下十条线
    for (let i = 0; i < 10; i++) {
      this.linesPw.push(new LinePaneView(this, {
        onDragging: (delta, _, success) => {
          const timeScale = this.chart.timeScale()
          if (
            tryToMove(timeScale, this.series, this.option.p1, delta)
            && tryToMove(timeScale, this.series, this.option.p2, delta)
          )
            success()
        },
        anchor: () => this.pixelP2,
      }))
    }
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
    this._paneViews.push(...this.linesPw, this.p1, this.p2)
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

    const leftX = Math.min(pixelP1.x, pixelP2.x)
    const rightX = Math.max(pixelP1.x, pixelP2.x)

    const deltaPrice = Math.abs(this.option.p1.price - this.option.p2.price)

    if (pixelP1.y > pixelP2.y) {
      // 从下到上
      this.updateLines('up', deltaPrice, leftX, rightX)
    }
    else {
      // 从上到下
      this.updateLines('down', deltaPrice, leftX, rightX)
    }

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

  private updateLines(direction: 'up' | 'down', deltaPrice: number, leftX: number, rightX: number) {
    const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618, 2.618, 3.618, 4.236]
    const colors = ['#787B86', '#F23645', '#FF9E00', '#4EB451', '#089981', '#00BCD4', '#787B86', '#2962FF', '#FF3948', '#9C27B0', '#E91E63']

    fibLevels.forEach((level, index) => {
      const price = this.option.p2.price + level * deltaPrice * (direction === 'up' ? -1 : 1)
      const point = convertChart2Point(this.chart.timeScale(), this.series, {
        price: Number.parseFloat(price.toFixed(3)),
        logicalTime: this.option.p2.logicalTime,
      })
      this.linesPw[index].update({
        x1: leftX,
        y1: point.y,
        x2: rightX,
        y2: point.y,
        strockColor: colors[index],
        strockWidth: 3,
        extendP1: false,
        extendP2: false,
      })
    })
  }
}

interface FabLineOption {
  p1: ChartPoint
  p2: ChartPoint
}
