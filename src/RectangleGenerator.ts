import Rectangle from '@/Rectangle'
import Eagle from '@/Eagle'

export default class RectangleGenerator {
  private canvas: HTMLCanvasElement
  public readonly rects: Rectangle[] = []
  private lastRectTime: number = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  public generateRectangles(): void {
    const currentTime = new Date().getTime()

    if (currentTime - this.lastRectTime > 2000) {
      // Create a new rectangle with a random height and position
      const height = Math.floor(Math.random() * 100) + 50
      const position = Math.floor(Math.random() * (this.canvas.height - height))
      const rect = new Rectangle(this.canvas.width, position, 50, height, 0.5)

      // Add the rectangle to the list of rectangles
      this.rects.push(rect)

      // Update the last rectangle generation time
      this.lastRectTime = currentTime
    }

    // Move each rectangle to the left
    for (let i = 0; i < this.rects.length; i++) {
      this.rects[i].x -= 5
    }

    // Remove any rectangles that have gone off the screen
    for (let i = 0; i < this.rects.length; i++) {
      if (this.rects[i].x + this.rects[i].width < 0) {
        this.rects.splice(i, 1)
        i--
      }
    }
  }

  update() {
    for (const rect of this.rects) {
      rect.update()
    }

    if (this.rects.length === 0) {
      return
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

  collidesWithEagle(eagle: Eagle) {
    for (const rect of this.rects) {
      if (rect.collidesWithEagle(this.canvas, eagle)) {
        return true
      }
    }

    return false
  }
}
