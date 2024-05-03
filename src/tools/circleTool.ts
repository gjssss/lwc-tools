import { Circle } from '../models/circle'
import type { ToolInstallContext, ToolOption } from '../types/tool'

export function CircleTool(context: ToolInstallContext, end: () => void): ToolOption {
  let previewCircle: null | Circle = null
  const { series } = context
  return {
    name: 'circle',
    onClick: (_, event) => {
      const price = event.getPrice()
      const time = event.getTime()
      if (price && time)
        previewCircle = null
      end()
    },
    onMove: (_, event) => {
      const price = event.getPrice()
      const time = event.getTime()
      if (price && time) {
        if (previewCircle === null) {
          previewCircle = new Circle({ price, time }, 10)
          series.attachPrimitive(previewCircle)
        }
        else {
          previewCircle.center = { price, time }
        }
      }
    },
  }
}
