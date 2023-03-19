import Rectangle from '@/Rectangle'

export default class RectangleGenerator {
  public rectangles: Rectangle[] = []
  private lastRectTime: number = 0

  constructor(private canvas: HTMLCanvasElement) {}

  public generateRectangles(timestamp: number): void {
    // If this is the first time the method is called, set the last rectangle generation time to the current timestamp
    if (!this.lastRectTime) {
      this.lastRectTime = timestamp
    }

    const elapsed = timestamp - this.lastRectTime

    if (elapsed > 2000) {
      // Generate the first rectangle
      const height1 = Math.floor(Math.random() * 100) + 200
      const positionY1 = 0
      const rect1 = new Rectangle(this.canvas.width, positionY1, height1)

      // Determine the minimum gap between the two rectangles
      const minGap = 150

      // Calculate the maximum height for the second rectangle to ensure a minimum gap
      const maxHeight2 = this.canvas.height - (positionY1 + height1) - minGap

      // If the maximum height is less than the minimum height, use the minimum height instead
      const minHeight2 = 68
      const height2 = Math.max(
        minHeight2,
        Math.floor(Math.random() * maxHeight2),
      )

      const positionY2 = this.canvas.height - height2
      const rect2 = new Rectangle(this.canvas.width, positionY2, height2)

      // Add the rectangles to the list of rectangles
      this.rectangles.push(rect1, rect2)

      // Update the last rectangle generation time
      this.lastRectTime = timestamp
    }

    // Remove any rectangles that have gone off the screen
    this.rectangles = this.rectangles.filter(
      (rectangle) => rectangle.x + rectangle.width >= 0,
    )
  }

  public clear() {
    this.rectangles = []
  }

  public update() {
    for (const rectangle of this.rectangles) {
      rectangle.update()
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const rectangle of this.rectangles) {
      rectangle.draw(ctx)
    }
  }
}
