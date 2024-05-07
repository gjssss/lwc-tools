import { Line } from '../models/line'
import type { ChartToolContext, ToolOption } from '../types/tool'

export function LineTool(context: ChartToolContext, end: () => void): ToolOption {
  let previewLine: null | Line = null
  const { series } = context
  let step = 0
  return {
    name: 'line',
    onClick: (_, event) => {
      const price = event.getPrice()
      const time = event.getTime()

      if (price && time) {
        if (step === 1) {
          step = 2
        }
        else if (step === 2) {
          previewLine?.completeCreate()
          previewLine = null
          step = 0
          end()
        }
      }
    },
    onMove: (_, event) => {
      const price = event.getPrice()
      const time = event.getTime()
      if (price && time) {
        // 首先先创建线段
        if (step === 0) {
          previewLine = new Line(context, {
            p1: { price, time },
            p2: { price, time },
          })
          series.attachPrimitive(previewLine)
          step = 1
        }
        // 当有圆后，点击前预览位置
        else if (step === 1) {
          previewLine!.option.p1 = { price, time }
          previewLine!.option.p2 = { price, time }
        }
        // 位置确定后决定半径
        else if (step === 2) {
          previewLine!.option.p2 = { price, time }
        }
      }
    },
  }
}
