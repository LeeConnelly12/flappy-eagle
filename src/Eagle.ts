import Rectangle from '@/Rectangle'

export default class Eagle {
  public velocityY = 0
  private gravity = 0.5
  public score = 0
  private frameDelay = 5
  private frameCount = 0
  private spriteIndex = 0
  private sprites: Array<HTMLImageElement>
  private maxVelocityY = 18

  constructor(
    public width: number,
    public height: number,
    public radius: number,
    public x: number,
    public y: number,
    sprites: string[],
  ) {
    this.sprites = sprites.map((sprite) => {
      const image = new Image()
      image.src = sprite
      return image
    })
  }

  public draw(context: CanvasRenderingContext2D) {
    // Increment frameCount
    this.frameCount++

    // Check if it's time to change the sprite
    if (this.frameCount >= this.frameDelay) {
      // Change sprite index and reset frameCount
      this.spriteIndex = (this.spriteIndex + 1) % this.sprites.length
      this.frameCount = 0
    }

    // Calculate rotation angle based on velocity
    const rotationAngle = (Math.PI / 6) * (this.velocityY / this.maxVelocityY)

    // Save the current context state
    context.save()

    // Translate to the eagle's position
    context.translate(this.x, this.y)

    // Rotate based on velocity
    context.rotate(rotationAngle)

    // Draw the current sprite
    const image = this.sprites[this.spriteIndex]

    context.drawImage(
      image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    )

    // Restore the saved context state
    context.restore()
  }

  public update(rectangles: Rectangle[]) {
    this.y += this.velocityY
    this.velocityY += this.gravity

    // Check if eagle has passed any rectangles.
    rectangles.forEach((rect) => {
      if (rect.passed) {
        return
      }

      if (this.x <= rect.x + rect.width) {
        return
      }

      const passedTwoRectangles = rectangles.some(
        (r) => r !== rect && r.x === rect.x,
      )

      this.score += passedTwoRectangles ? 0.5 : 1.0

      rect.passed = true
    })
  }

  public reset(canvas: HTMLCanvasElement) {
    this.x = canvas.width / 2.5
    this.y = canvas.height / 2
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
    this.velocityY = -8
  }
}
