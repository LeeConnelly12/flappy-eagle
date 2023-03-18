import Rectangle from '@/Rectangle'

export default class Eagle {
  public velocityY = 0
  private gravity = 0.8
  public width = 68
  public height = 48
  public radius = 25
  public initialX: number
  public initialY: number
  public x: number
  public y: number
  private frameDelay = 5
  private frameCount = 0
  private spriteIndex = 0
  private spriteURLs = [
    '/images/upflap.png',
    '/images/midflap.png',
    '/images/downflap.png',
  ]
  private sprites: Array<HTMLImageElement>
  private maxVelocityY = 18

  constructor(x: number, y: number) {
    this.initialX = x
    this.initialY = y
    this.x = x
    this.y = y

    this.sprites = this.spriteURLs.map((sprite) => {
      const image = new Image()
      image.src = sprite
      return image
    })
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // Increment frameCount
    this.frameCount++

    // Check if it's time to change the sprite
    if (this.frameCount >= this.frameDelay) {
      // Change sprite index and reset frameCount
      this.spriteIndex = (this.spriteIndex + 1) % this.sprites.length
      this.frameCount = 0
    }

    // Calculate rotation angle based on velocity
    const rotationAngle =
      (Math.PI / 6) * (this.velocityY / this.maxVelocityY) * 24

    // Save the current context state
    ctx.save()

    // Translate to the eagle's position
    ctx.translate(this.x, this.y)

    // Rotate based on velocity
    ctx.rotate(rotationAngle)

    // Draw the current sprite
    const image = this.sprites[this.spriteIndex]

    ctx.drawImage(
      image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    )

    // Restore the saved context state
    ctx.restore()
  }

  public update(deltaTime: number) {
    const timeInSeconds = deltaTime / 1000

    // Apply gravity to the velocity
    this.velocityY += this.gravity * timeInSeconds

    // Limit the velocity to prevent the eagle from moving too fast
    this.velocityY = Math.min(this.velocityY, this.maxVelocityY)

    // Update the eagle's position based on the velocity and elapsed time
    this.y += this.velocityY * deltaTime
  }

  public reset() {
    this.x = this.initialX
    this.y = this.initialY
    this.velocityY = 0
  }

  public collidesWithRectangles(rectangles: Rectangle[]): boolean {
    // Create a rectangle that represents the bounds of the eagle
    const eagleRect = new Rectangle(
      this.x - this.width / 1.5,
      this.y - this.height / 2,
      this.height,
    )

    for (let i = 0; i < rectangles.length; i++) {
      const rect = rectangles[i]

      // Check if the eagle's bounds intersect with the rectangle
      if (eagleRect.intersects(rect)) {
        return true
      }
    }

    return false
  }

  public jump() {
    this.velocityY = -0.4
  }
}
