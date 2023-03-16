import Rectangle from '@/Rectangle'

export default class RectangleGenerator {
  private canvas: HTMLCanvasElement
  public rects: Rectangle[] = []
  private lastRectTime: number = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  public generateRectangles(timestamp: number): void {
    // If this is the first time the method is called, set the last rectangle generation time to the current timestamp
    if (!this.lastRectTime) {
      this.lastRectTime = timestamp
    }

    const elapsed = timestamp - this.lastRectTime

    if (elapsed > 2000) {
      // Create a new rectangle with a random height and position
      const height = Math.floor(Math.random() * 100) + 50
      const position = Math.floor(Math.random() * (this.canvas.height - height))
      const rect = new Rectangle(this.canvas.width, position, 50, height, 0.5)

      // Add the rectangle to the list of rectangles
      this.rects.push(rect)

      // Update the last rectangle generation time
      this.lastRectTime = timestamp
    }

    // Move each rectangle to the left
    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i]
      rect.x -= 5
    }

    // Remove any rectangles that have gone off the screen
    this.rects = this.rects.filter((rect) => rect.x + rect.width >= 0)
  }

  update() {
    if (this.rects.length === 0) {
      return
    }

    for (const rect of this.rects) {
      rect.update()
    }

    if (this.rects[0].x + this.rects[0].width < 0) {
      this.rects.splice(0, 2)
    }
  }

  draw(context: CanvasRenderingContext2D) {
    for (const rect of this.rects) {
      rect.draw(context)
    }
  }
}
