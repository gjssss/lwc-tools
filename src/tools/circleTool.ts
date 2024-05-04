import { Circle } from '../models/circle'
import type { ChartToolContext, ToolOption } from '../types/tool'

export function CircleTool(context: ChartToolContext, end: () => void): ToolOption {
  let previewCircle: null | Circle = null
  const { series } = context
  let step = 0
  return {
    name: 'circle',
    onClick: (_, event) => {
      const price = event.getPrice()
      const time = event.getTime()

      if (price && time) {
        if (step === 1) {
          step = 2
        }
        else if (step === 2) {
          previewCircle = null
          step = 0
          end()
        }
      }
    },
    onMove: (_, event) => {
      const price = event.getPrice()
      const time = event.getTime()
      if (price && time) {
        // 首先先创建圆
        if (step === 0) {
          previewCircle = new Circle(context, {
            center: { price, time },
            pos: { price, time },
          })
          series.attachPrimitive(previewCircle)
          step = 1
        }
        // 当有圆后，点击前预览位置
        else if (step === 1) {
          previewCircle!.option.center = { price, time }
          previewCircle!.option.pos = { price, time }
        }
        // 位置确定后决定半径
        else if (step === 2) {
          previewCircle!.option.pos = { price, time }
        }
      }
    },
  }
}
