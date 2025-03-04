import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../core/navigation.service';
import { HintsBlockComponent } from './hints-block/hints-block.component';
import { PuzzleFieldComponent } from './puzzle-field/puzzle-field.component';
import { PuzzlesBlockComponent } from './puzzles-block/puzzles-block.component';
import { PuzzleGameCardsDataService } from './services/puzzle-game-cards-data.service';

@Component({
  selector: 'app-puzzle-game-page',
  imports: [HintsBlockComponent, PuzzleFieldComponent, PuzzlesBlockComponent],
  templateUrl: './puzzle-game-page.component.html',
  styleUrl: './puzzle-game-page.component.scss',
})
export class PuzzleGamePageComponent {
  private navigation = inject(NavigationService);

  private route = inject(ActivatedRoute);

  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  currentSentence = signal(['']);

  level = signal(1);

  round = signal(0);

  sentenceNumber = signal(0);

  isCorrect = signal<boolean>(false);

  completedSentence: string[] = [];

  sourceWords: string[] = [];

  correctSentences = signal<string[][]>([]);

  sentencesInRound = '';

  test: string[] = []; // to delete


  ngOnInit(): void {
    this.navigation.getPathName(this.route);
    this.currentSentence = this.puzzlesDataService.currentSentence;
    this.correctSentences = this.puzzlesDataService.correctSentences;

    this.level = this.puzzlesDataService.level;
    this.round = this.puzzlesDataService.round;
    this.sentenceNumber = this.puzzlesDataService.sentenceNumber;

    this.isCorrect = this.puzzlesDataService.isCorrect;
    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      this.completedSentence = data;
    })
    this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
      this.sourceWords = data;
    }) //

    // 1) check button is disabled if source block is not empty
    // 2) continue button appears if a sentence is correct
    // 3) continue <=> check buttons logic
  }

  isCorrectlyConstucted() {
    const sentence = computed(() => {
      return this.currentSentence().toString();
    })

    if (sentence() === this.completedSentence.join()) {
      this.isCorrect.update(() => true);
      console.log(this.isCorrect(),'Correct!');
      this.correctSentences.update((value) => {
        value.push(this.currentSentence());
        return value;
      })
    } else {
      this.isCorrect.update(() => false);
      console.log(this.isCorrect(),'Try again');
    }
  }

  continue() {
    this.sentenceNumber.update((value) => value + 1);
    console.log(this.isCorrect());

    this.puzzlesDataService.getCardsData(this.level()).subscribe((data) =>{
      const card = data.rounds[this.round()].words[this.sentenceNumber()];
      if (card) {
      this.isCorrect.update(() => true);
      this.puzzlesDataService.getWordsData(this.level(), this.round(), this.sentenceNumber())
        .subscribe((data) => {
          this.sourceWords = data;
        })
      this.isCorrect.update(() => false);
      console.log('Continue button', this.isCorrect());
      } else {
        console.log(this.isCorrect(), 'New Round');
      }
    });
    this.puzzlesDataService.resultPuzzles$.next([]);
    this.isCorrect.update(() => false);
    console.log('Continue button works');
  }

  // changeSentence() {
  //   const sentence = computed(() => {
  //     return this.currentSentence().toString();
  //   })

  //   if (sentence() === this.completedSentence.join() && this.sentenceNumber() <= 9) {
  //     this.sentenceNumber.update((value) => value + 1);
  //     this.isCorrect.update(() => true); // to delete
  //     this.correctSentences.update((value) => {
  //       value.push(this.currentSentence());
  //       return value;
  //     }) // to delete

  //     console.log(this.sentenceNumber())
  //     this.puzzlesDataService.getCardsData(this.level()).subscribe((data) =>{
  //       const card = data.rounds[this.round()].words[this.sentenceNumber()];
  //       if (card) {
  //         this.puzzlesDataService.getWordsData(this.level(), this.round(), this.sentenceNumber())
  //           .subscribe((data) => {
  //             this.sourceWords = data;
  //           })
  //         this.sentencesInRound = card.textExample; // to delete
  //       } else {
  //         this.isCorrect.update(() => false);
  //         console.log(this.isCorrect(), 'New Round');
  //       }
  //       console.log('Testing', this.sentencesInRound); // to delete
  //     }
  //     ) // useful
  //     console.log('Correct', this.isCorrect());
  //   } else {
  //     // round changing ??
  //     this.isCorrect.update(() => false); // to delete
  //     console.log(this.isCorrect(), this.sentenceNumber(), 'Try again'); // delete
  //   }
  // }
}
