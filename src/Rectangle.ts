import Eagle from '@/Eagle'

export default class Rectangle {
  x: number
  y: number
  width = 80
  height: number
  speed = 4
  isPast = false

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

  intersects(other: Rectangle): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    )
  }

  public isPastEagle(eagleX: number): boolean {
    if (this.isPast) {
      return false
    }

    if (eagleX <= this.x + this.width / 2) {
      return false
    }

    return true
  }

  public isTouchingEagle(eagle: Eagle): boolean {
    // Calculate the eagle's position in the next frame based on its current velocity
    const nextEagleY = eagle.y + eagle.velocityY

    // Check if the eagle is above or below the rectangle
    if (
      nextEagleY + eagle.radius < this.y ||
      nextEagleY - eagle.radius > this.y + this.height
    ) {
      return false
    }

    // Check if the eagle is to the left or right of the rectangle
    if (
      eagle.x + eagle.radius < this.x ||
      eagle.x - eagle.radius > this.x + this.width
    ) {
      return false
    }

    // If none of the above conditions are true, the eagle is touching the rectangle
    return true
  }
}
