import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[backgroundImage]'
})
export class BackgroundImageDirective {

  renderer = inject(Renderer2);

  element = inject(ElementRef);

  @Input() set backgroundImage (imagePath: string) {
    if(imagePath.length > 0) {
      this.renderer.setStyle(
        this.element.nativeElement,
        'backgroundImage',
        `url(${imagePath})`
      )
     } else {
      this.renderer.setStyle(
        this.element.nativeElement,
        'backgroundImage',
        `url('')`
        )
      }
    }
}
