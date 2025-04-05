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
      image: string,
      puzzleCroppingX: number,
      puzzleCroppingY: number,
    }) {

    // {word, image, imagePosition, imageIndex(index in ngFor that indicates puzzle's shape)}
    // should all the image cropping coordinates be added in service?
    const canvas = this.element.nativeElement;
    const canvasCtx = canvas.getContext('2d');
    const bgImage = new Image();
    bgImage.src = obj.image;

    bgImage.onload = () => {
      // console.log('Image Loaded', bgImage.src);
      canvasCtx.beginPath();
      canvasCtx.moveTo(10, 10);
      canvasCtx.bezierCurveTo(10, 95, 50, 34, 45, 80);
      canvasCtx.bezierCurveTo(45, 115, 10, 80, 20, 145);
      canvasCtx.lineTo(300, 145);
      canvasCtx.lineTo(300, 10);
      canvasCtx.lineTo(10, 10);
      canvasCtx.closePath();
      canvasCtx.clip();

      const sourceX = obj.puzzleCroppingX;
      const sourceY = obj.puzzleCroppingY;
      const sourceWidth = 100;
      const sourceHeight = 40;

      const destX = 0;
      const destY = 0;
      const destWidth = canvas.width;
      const destHeight = canvas.height;

      canvasCtx.drawImage(bgImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

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
