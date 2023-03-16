export default class Rectangle {
  x: number
  y: number
  width = 80
  height: number
  speed = 4
  passed = false

  constructor(x: number, y: number, height: number) {
    this.x = x
    this.y = y
    this.height = height
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#73be2e'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  update() {
    this.x -= this.speed
  }

  isOffScreen() {
    return this.x + this.width < 0
  }
}
