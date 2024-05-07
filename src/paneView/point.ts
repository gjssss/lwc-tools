import { CirclePaneView } from './circle'

export class AnchoredPoint extends CirclePaneView {
  public override update(option: { x: number, y: number }): void {
    this.option = {
      x: option.x,
      y: option.y,
      radius: 5,
      strockWidth: 2,
      strockColor: '#1F56EF',
      fillColor: 'white',
    }
  }
}
