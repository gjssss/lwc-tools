import type { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts'
import type { MouseEventHandle } from '../share/mouse'

export interface ToolOption {
  name: string
  onClick?: MouseEventHandle
  onMove?: MouseEventHandle
  onPushMove?: MouseEventHandle
}

export interface ToolInstallContext {
  chart: IChartApi
  series: ISeriesApi<SeriesType>
}

export type ToolInstaller = (context: ToolInstallContext, end: () => void) => ToolOption
