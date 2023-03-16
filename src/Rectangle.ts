import Eagle from '@/Eagle'

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

  collidesWithEagle(canvas: HTMLCanvasElement, eagle: Eagle) {
    if (eagle.y < 0 || eagle.y + eagle.height > canvas.height) {
      return true // eagle has hit the top or bottom of canvas
    }

    if (
      this.x + this.width > eagle.x &&
      this.x < eagle.x + eagle.width &&
      this.y + this.height > eagle.y &&
      this.y < eagle.y + eagle.height
    ) {
      return true // eagle has collided with this rectangle
    }

    return false
  }
}
