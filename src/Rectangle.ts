export default class Rectangle {
  x: number
  y: number
  width: number
  height: number
  speed: number

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
  ) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.speed = speed
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {
    this.x -= this.speed
  }

  isOffScreen() {
    return this.x + this.width < 0
  }
}
