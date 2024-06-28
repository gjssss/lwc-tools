import type { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts'
import { MouseHandler } from './helpers/mouse'
import type { ChartToolContext, ChartToolOption, ToolInstaller, ToolOption } from './types/tool'
import { PluginBase } from './models/base'

class UpdatePlugin extends PluginBase {
  updateAllViews(): void {
  }

  public forceUpdate = () => {
    return this.requestUpdate()
  }
}

function defaultFunc() {}

export function createChartTool(chart: IChartApi, series: ISeriesApi<SeriesType>, option?: ChartToolOption) {
  const mouse = new MouseHandler()
  const update = new UpdatePlugin()
  series.attachPrimitive(update)
  mouse.init(chart, series, update.forceUpdate)

  const tools = new Map<string, ToolOption>()
  let activeTool: string | null = null

  const context: ChartToolContext = {
    chart,
    series,
    mouse,
    selectWidget: null,
    update: update.forceUpdate,
    onSelect: option ? (option.onSelect ?? defaultFunc) : defaultFunc,
  }
  const onDraw = option ? (option.onDraw ?? defaultFunc) : defaultFunc
  const onDrawOver = option ? (option.onDrawOver ?? defaultFunc) : defaultFunc

  function install(installer: ToolInstaller) {
    const option = installer(context, () => {
      if (activeTool)
        onDrawOver(activeTool)

      activeTool = null
    })
    if (tools.get(option.name))
      throw new Error('duplicate `name` was installed')
    tools.set(option.name, option)
    return () => {
      activeTool = option.name
      onDraw(option.name)
    }
  }

  function getSelectWidget() {
    return context.selectWidget
  }

  mouse.addMouseEventListener('mouseup', (pos, event) => {
    if (activeTool) {
      const option = tools.get(activeTool)
      if (option)
        option.onClick?.call(undefined, pos, event)
      else
        activeTool = null
    }
  })

  mouse.addMouseEventListener('mousemove', (pos, event) => {
    if (activeTool) {
      const option = tools.get(activeTool)
      if (option)
        option.onMove?.call(undefined, pos, event)
      else
        activeTool = null
    }
  })

  mouse.addMouseEventListener('mousePressedMove', (pos, event) => {
    if (activeTool) {
      const option = tools.get(activeTool)
      if (option)
        option.onPushMove?.call(undefined, pos, event)
      else
        activeTool = null
    }
  })

  return {
    install,
    getSelectWidget,
    update: update.forceUpdate,
  }
}

export * from './tools'
