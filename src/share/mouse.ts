import type { IChartApi, ISeriesApi, SeriesType, Time } from 'lightweight-charts'
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
}

export type MouseEventHandle = (pos: Point, event: MouseEventObject) => void

export class MouseHandler implements IDestroyable {
  protected _chart?: IChartApi
  protected _series?: ISeriesApi<SeriesType>
  protected _chartElement?: HTMLElement
  protected _unSubscribers: Function[] = []
  protected _update?: Function

  protected _mousedowns: MouseEventHandle[] = []
  protected _mouseups: MouseEventHandle[] = []
  protected _mousemoves: MouseEventHandle[] = []
  protected _mousePressedMoves: MouseEventHandle[] = []

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

  addMouseEventListener(
    eventType: MouseEventType,
    handler: MouseEventHandle,
  ): void {
    switch (eventType) {
      case 'mousedown':
        this._mousedowns.push(handler)
        break
      case 'mousemove':
        this._mousemoves.push(handler)
        break
      case 'mouseup':
        this._mouseups.push(handler)
        break
      case 'mousePressedMove':
        this._mousePressedMoves.push(handler)
        break
      default:
        break
    }
  }

  removeMouseEventListener(
    eventType: MouseEventType,
    handler: MouseEventHandle,
  ): void {
    switch (eventType) {
      case 'mousedown':
        remove(this._mousedowns, item => item === handler)
        break
      case 'mousemove':
        remove(this._mousemoves, item => item === handler)
        this._mousemoves.push(handler)
        break
      case 'mouseup':
        remove(this._mouseups, item => item === handler)
        break
      case 'mousePressedMove':
        remove(this._mousePressedMoves, item => item === handler)
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
      getTime: () => this.getTime(this.getCanvasX(event.clientX)),
    }
  }

  protected _buildPos(event: MouseEvent) {
    return new Point(this.getCanvasX(event.clientX), this.getCanvasY(event.clientY))
  }

  protected _execHandle(event: MouseEvent, handles: MouseEventHandle[]) {
    for (let i = 0; i < handles.length; i++) {
      const pos = this._buildPos(event)
      const eventObj = this._buildEvent(event)
      handles[i](pos, eventObj)
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

let _mouseHandler: MouseHandler | undefined

/// / /**
/// //  * 单例模式获取鼠标事件管理器
/// //  */
// export function useMouseHandler() {
//   if (!_mouseHandler)
//     _mouseHandler = new MouseHandler()
//   return _mouseHandler
// }
