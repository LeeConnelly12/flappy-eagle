import Rectangle from '@/Rectangle'

export default class Eagle {
  public velocityY = 0
  private gravity = 0.4
  public score = 0

  constructor(
    public width: number,
    public height: number,
    public radius: number,
    public x: number,
    public y: number,
  ) {}

  public draw(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.stroke()
  }

  public update(rectangles: Rectangle[]) {
    this.y += this.velocityY
    this.velocityY += this.gravity

    // Check if eagle has passed any rectangles.
    rectangles.forEach((rect) => {
      if (!rect.passed && this.x > rect.x + rect.width) {
        rect.passed = true
        this.score++
      }
    })
  }

  public reset(canvas: HTMLCanvasElement) {
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.velocityY = 0
  }

  public collidesWithRectangles(rectangles: Rectangle[]): boolean {
    for (let i = 0; i < rectangles.length; i++) {
      const rect = rectangles[i]
      const rectCenterX = rect.x + rect.width / 2
      const rectCenterY = rect.y + rect.height / 2
      const circleDistanceX = Math.abs(this.x - rectCenterX)
      const circleDistanceY = Math.abs(this.y - rectCenterY)
      const rectHalfWidth = rect.width / 2
      const rectHalfHeight = rect.height / 2

      // Check if the circle's x-coordinate is outside the rectangle
      if (circleDistanceX > rectHalfWidth + this.radius) {
        return false
      }

      // Check if the circle's y-coordinate is outside the rectangle
      if (circleDistanceY > rectHalfHeight + this.radius) {
        return false
      }

      // Check if the circle's x-coordinate is within the rectangle
      if (circleDistanceX <= rectHalfWidth) {
        return true
      }

      // Check if the circle's y-coordinate is within the rectangle
      if (circleDistanceY <= rectHalfHeight) {
        return true
      }

      // Check if the circle collides with the corner of the rectangle
      const cornerDistanceSq =
        Math.pow(circleDistanceX - rectHalfWidth, 2) +
        Math.pow(circleDistanceY - rectHalfHeight, 2)
      if (cornerDistanceSq <= Math.pow(this.radius, 2)) {
        return true
      }
    }

    return false
  }
}
