import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[canvasRenderer]'
})
export class CanvasRendererDirective {
  private element = inject(ElementRef);

  private renderer = inject(Renderer2);

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
    const canvasCtx = canvas.getContext('2d');
    const bgImage = new Image();
    bgImage.src = obj.image;

    bgImage.onload = () => {
      canvasCtx.beginPath();
      if (obj.puzzleIndex === 0) {
        // first puzzle shape
        canvasCtx.moveTo(10, 10);
        canvasCtx.lineTo(10, 145);
        canvasCtx.lineTo(250, 145);
        canvasCtx.bezierCurveTo(230, 90, 290, 115, 270, 65);
        canvasCtx.bezierCurveTo(265, 60, 240, 55, 250, 10);
        canvasCtx.lineTo(10, 10);
        canvasCtx.clip();
      } else if (obj.puzzleIndex === obj.wordsNumber - 1) {
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

      // image
      const sourceX = obj.puzzleCroppingX;
      const sourceY = obj.puzzleCroppingY;
      const sourceWidth = 100;
      const sourceHeight = 40;

      const destX = 0;
      const destY = 0;
      const destWidth = canvas.width;
      const destHeight = canvas.height;

      canvasCtx.drawImage(bgImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

      // text styling
      canvasCtx.fillStyle = 'rgba(228, 206, 206, 0.9)';
      canvasCtx.fillRect(90, 25, 120, 75);
      canvasCtx.fillStyle = 'rgb(180, 104, 207)';
      canvasCtx.font = '30px Arial';
      canvasCtx.fillText(`${obj.word}`, 115, 80);
      canvasCtx.strokeStyle = `${obj.color}`;
      canvasCtx.stroke();
    }
  }
}
