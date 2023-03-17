import Rectangle from '@/Rectangle'

export default class RectangleGenerator {
  public rects: Rectangle[] = []
  private lastRectTime: number = 0

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {}

  public generateRectangles(timestamp: number): void {
    // If this is the first time the method is called, set the last rectangle generation time to the current timestamp
    if (!this.lastRectTime) {
      this.lastRectTime = timestamp
    }

    const elapsed = timestamp - this.lastRectTime

    if (elapsed > 2000) {
      // Determine if we should generate one or two rectangles
      const numRectsToGenerate = Math.random() < 0.5 ? 1 : 2

      // Determine if the first rectangle should be attached to the top or bottom of the canvas
      const attachToTop = Math.random() < 0.5

      // Generate the first rectangle
      const height1 = Math.floor(Math.random() * 100) + 200
      const positionY1 = attachToTop ? 0 : this.canvas.height - height1
      const rect1 = new Rectangle(this.canvas.width, positionY1, height1)

      // If we're generating two rectangles, generate the second rectangle
      let rect2: Rectangle | null = null
      if (numRectsToGenerate === 2) {
        // Determine if the second rectangle should be attached to the top or bottom of the canvas
        const attachToTop2 = !attachToTop

        // Generate the second rectangle with a heavily skewed height
        const height2 = Math.floor(Math.random() * 300) + 50
        const positionY2 = attachToTop2 ? 0 : this.canvas.height - height2
        rect2 = new Rectangle(this.canvas.width, positionY2, height2)
      }

      // Add the rectangles to the list of rectangles
      this.rects.push(rect1)
      if (rect2) {
        this.rects.push(rect2)
      }

      // Update the last rectangle generation time
      this.lastRectTime = timestamp
    }

    // Remove any rectangles that have gone off the screen
    this.rects = this.rects.filter((rect) => rect.x + rect.width >= 0)
  }

  update() {
    for (const rect of this.rects) {
      rect.update()
    }
  }

  public draw() {
    for (const rect of this.rects) {
      rect.draw(this.ctx)
    }
  }
}
