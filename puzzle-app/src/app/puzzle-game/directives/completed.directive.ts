import { Directive, ElementRef, inject, Input, OnChanges, OnInit, Renderer2, signal, SimpleChanges } from '@angular/core';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';
import { delay, of } from 'rxjs';

@Directive({
  selector: '[completed]'
})
export class CompletedDirective implements OnChanges, OnInit {

  private element = inject(ElementRef);

  private renderer = inject(Renderer2);

  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  completedArr: {level: number, round: number}[] = [];

  level = signal<number>(1);

  ngOnInit(): void {
    this.level = this.puzzlesDataService.level;
  }


  @Input() set setCompletedStyles(completedArr: {level: number, round: number}[]) {
      if(completedArr.length > 0) {
        this.completedArr = completedArr;
        // for (let i = 0; i < completedArr.length; i++) {
        //   if(parseInt(this.element.nativeElement.value) === completedArr[i].round + 1){
        //     this.renderer.addClass(this.element.nativeElement, 'completed');
        //   } else {
        //   }
        // }
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['setCompletedStyles']) {
      of(this.completedArr).pipe(
        delay(2000)
      ).subscribe((data) => {
        if(data.length > 0) {
          for (let i = 0; i < data.length; i++) {
          if(+this.element.nativeElement.innerText === data[i].round + 1 &&
            this.level() === data[i].level
          ){
            this.renderer.addClass(this.element.nativeElement, 'completed');
          }
          }
        }
      });
    }
  }
}
