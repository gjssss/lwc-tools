import type { IChartApi, ISeriesApi, Logical, SeriesType, Time } from 'lightweight-charts'
import { remove } from 'lodash-es'
import { Point } from '../helpers/Point'
import type { IDestroyable } from '../helpers/idestroyable'
import { ensureDefined } from '../helpers/assertions'

type MouseEventType = 'mousemove' | 'mousedown' | 'mouseup' | 'mousePressedMove'

export interface MouseEventObject extends MouseEvent {
  isConsumed: boolean
  isPush: boolean
  getTime: () => Time | null
  getPrice: () => number | null
  getLogical: () => Logical | null
}

export type MouseEventHandle = (pos: Point, event: MouseEventObject) => void
interface EventSymbol {
  handler: MouseEventHandle
  symbol: symbol
}

export class MouseHandler implements IDestroyable {
  protected _chart?: IChartApi
  protected _series?: ISeriesApi<SeriesType>
  protected _chartElement?: HTMLElement
  protected _unSubscribers: Function[] = []
  protected _update?: Function

  protected _mousedowns: EventSymbol[] = []

  protected _mouseups: EventSymbol[] = []

  protected _mousemoves: EventSymbol[] = []

  protected _mousePressedMoves: EventSymbol[] = []

  protected _isPush: boolean = false

  init(chart: IChartApi, series: ISeriesApi<SeriesType>, update: Function) {
    this._chart = chart
    this._series = series
    this._chartElement = chart.chartElement()
    this._update = update

    this.chartElement.addEventListener('mousedown', this._mousedownHandle)
    this.chartElement.addEventListener('mouseup', this._mouseupHandle)
    this.chartElement.addEventListener('mousemove', this._mousemoveHandle)
    this._unSubscribers.push(() => {
      this.chartElement.removeEventListener('mousedown', this._mousedownHandle)
    })
    this._unSubscribers.push(() => {
      this.chartElement.removeEventListener('mouseup', this._mouseupHandle)
    })
    this._unSubscribers.push(() => {
      this.chartElement.removeEventListener('mousemove', this._mousemoveHandle)
    })
  }

  protected get chart() {
    return ensureDefined(this._chart)
  }

  protected get series() {
    return ensureDefined(this._series)
  }

  protected get chartElement() {
    return ensureDefined(this._chartElement)
  }

  protected get update() {
    return ensureDefined(this._update)
  }

  getCanvasY(clientY: number) {
    const chartContainerBox = this.chartElement.getBoundingClientRect()
    return clientY - chartContainerBox.y
  }

  getCanvasX(clientX: number) {
    const chartContainerBox = this.chartElement.getBoundingClientRect()
    return clientX - chartContainerBox.x
  }

  getTime(x: number) {
    return this.chart.timeScale().coordinateToTime(x)
  }

  getPrice(y: number) {
    return this.series.coordinateToPrice(y)
  }

  getLogical(x: number) {
    return this.chart.timeScale().coordinateToLogical(x)
  }

  addMouseEventListener(
    eventType: MouseEventType,
    handler: MouseEventHandle,
  ): symbol {
    const symbol = Symbol('mouse')
    switch (eventType) {
      case 'mousedown':
        this._mousedowns.push({
          handler,
          symbol,
        })
        break
      case 'mousemove':
        this._mousemoves.push({
          handler,
          symbol,
        })
        break
      case 'mouseup':
        this._mouseups.push({
          handler,
          symbol,
        })
        break
      case 'mousePressedMove':
        this._mousePressedMoves.push({
          handler,
          symbol,
        })
        break
      default:
        break
    }
    return symbol
  }

  removeMouseEventListener(
    eventType: MouseEventType,
    symbol: symbol,
  ): void {
    switch (eventType) {
      case 'mousedown':
        remove(this._mousedowns, item => item.symbol === symbol)
        break
      case 'mousemove':
        remove(this._mousemoves, item => item.symbol === symbol)
        break
      case 'mouseup':
        remove(this._mouseups, item => item.symbol === symbol)
        break
      case 'mousePressedMove':
        remove(this._mousePressedMoves, item => item.symbol === symbol)
        break
      default:
        break
    }
  }

  protected _buildEvent(event: MouseEvent): MouseEventObject {
    return {
      ...event,
      isPush: this._isPush,
      isConsumed: false,
      getPrice: () => this.getPrice(this.getCanvasY(event.clientY)),
      getLogical: () => this.getLogical(this.getCanvasX(event.clientX)),
      getTime: () => this.getTime(this.getCanvasX(event.clientX)),
    }
  }

  protected _buildPos(event: MouseEvent) {
    return new Point(this.getCanvasX(event.clientX), this.getCanvasY(event.clientY))
  }

  protected _execHandle(event: MouseEvent, handles: EventSymbol[]) {
    for (let i = handles.length - 1; i >= 0; i--) {
      const pos = this._buildPos(event)
      const eventObj = this._buildEvent(event)
      handles[i].handler(pos, eventObj)
      if (eventObj.isConsumed)
        break
    }
    this.update()
  }

  protected _mousedownHandle = (event: MouseEvent) => {
    this._isPush = true
    this._execHandle(event, this._mousedowns)
  }

  protected _mouseupHandle = (event: MouseEvent) => {
    this._isPush = false
    this._execHandle(event, this._mouseups)
  }

  protected _mousemoveHandle = (event: MouseEvent) => {
    this._execHandle(event, this._mousemoves)
    if (this._isPush)
      this._execHandle(event, this._mousePressedMoves)
  }

  destroy() {
    this._unSubscribers.forEach((unSub) => {
      unSub()
    })
    this._unSubscribers.splice(0)
  }
}
