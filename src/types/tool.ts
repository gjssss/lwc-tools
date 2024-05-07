import type { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts'
import type { MouseEventHandle, MouseHandler } from '../helpers/mouse'
import type { WidgetBase } from '../models/widget'

export interface ToolOption {
  name: string
  onClick?: MouseEventHandle
  onMove?: MouseEventHandle
  onPushMove?: MouseEventHandle
}

export interface ChartToolContext {
  chart: IChartApi
  series: ISeriesApi<SeriesType>
  mouse: MouseHandler
  selectWidget: WidgetBase | null
}

export type ToolInstaller = (context: ChartToolContext, end: () => void) => ToolOption