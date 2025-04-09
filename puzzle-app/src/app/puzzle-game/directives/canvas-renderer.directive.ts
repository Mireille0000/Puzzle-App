import { Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[canvasRenderer]'
})
export class CanvasRendererDirective {
  private element = inject(ElementRef);

  @Input() set renderPuzzleElement(
    obj: {
      color: string,
      word: string,
      wordsNumber: number,
      image: string,
      puzzleCroppingX: number,
      puzzleCroppingY: number,
      puzzleIndex: number
    }) {
    const canvas = this.element.nativeElement;
    const canvasCtx: CanvasRenderingContext2D = canvas.getContext('2d');
    const bgImage = new Image();
    if (obj.image) {
      this.createPuzzle(canvasCtx, obj.puzzleIndex, obj.wordsNumber);
      bgImage.src = obj.image;
      bgImage.onload = () => {
        // image
        const wordCardWidth = bgImage.width / obj.wordsNumber;
        const sourceX = obj.puzzleCroppingX;
        const sourceY = obj.puzzleCroppingY + 45;

        const sourceWidth = wordCardWidth;
        const sourceHeight = 67;

        const destX = 0;
        const destY = 0;
        const destWidth = canvas.width;
        const destHeight = canvas.height;

        canvasCtx.drawImage(bgImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        // text styling
        this.styleCanvasTextOnBgImage(canvasCtx, canvas.width, obj.word, obj.color)
      }
    } else {
      this.createPuzzle(canvasCtx, obj.puzzleIndex, obj.wordsNumber);
      this.styleEmptyCanvas(canvasCtx, obj.word, obj.color);
    }
  }

  createPuzzle(canvasCtx: CanvasRenderingContext2D, puzzleIndex: number, wordsNumber: number) {
    canvasCtx.beginPath();
      if (puzzleIndex === 0) {
        // first puzzle shape
        canvasCtx.moveTo(10, 10);
        canvasCtx.lineTo(10, 145);
        canvasCtx.lineTo(250, 145);
        canvasCtx.bezierCurveTo(230, 90, 290, 115, 270, 65);
        canvasCtx.bezierCurveTo(265, 60, 240, 55, 250, 10);
        canvasCtx.lineTo(10, 10);
        canvasCtx.clip();
      } else if (puzzleIndex === wordsNumber - 1) {
        // last puzzle shape
        canvasCtx.moveTo(10, 10);
        canvasCtx.bezierCurveTo(10, 95, 50, 34, 45, 80);
        canvasCtx.bezierCurveTo(45, 115, 10, 80, 20, 145);
        canvasCtx.lineTo(300, 145);
        canvasCtx.lineTo(300, 10);
        canvasCtx.lineTo(10, 10);
        canvasCtx.closePath();
        canvasCtx.clip();
      } else {
        // middle puzzle shape
        canvasCtx.moveTo(10, 10);
        canvasCtx.bezierCurveTo(10, 95, 50, 34, 45, 80);
        canvasCtx.bezierCurveTo(45, 115, 10, 80, 20, 145);
        canvasCtx.lineTo(250, 145);
        canvasCtx.bezierCurveTo(230, 100, 270, 105, 275, 80);
        canvasCtx.bezierCurveTo(275, 40, 240, 70, 250, 10);
        canvasCtx.lineTo(10, 10);
        canvasCtx.closePath;
        canvasCtx.clip();
      }
  }

  styleEmptyCanvas(canvasCtx: CanvasRenderingContext2D, word: string, color: string) {
    canvasCtx.fillStyle = '#5b9ab5';
    canvasCtx.fill();
    canvasCtx.font = 'bold 35px Arial';
    canvasCtx.fillStyle = 'rgba(228, 206, 206, 0.9)';
    canvasCtx.fillText(`${word}`, 55, 80);
    canvasCtx.strokeStyle = `${color}`;
    canvasCtx.stroke();
  }

  styleCanvasTextOnBgImage(canvasCtx: CanvasRenderingContext2D, canvasWidth: number, word: string, color: string) {
    canvasCtx.fillStyle = 'rgba(228, 206, 206, 0.7)';
    canvasCtx.fillRect(0, 25, canvasWidth, 75);
    canvasCtx.fillStyle = 'rgb(90, 27, 113)';
    canvasCtx.font = 'bold 35px Arial';
    canvasCtx.fillText(`${word}`, 45, 80);
    canvasCtx.strokeStyle = `${color}`;
    canvasCtx.stroke();
  }
}
