import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../core/navigation.service';
import { HintsBlockComponent } from './hints-block/hints-block.component';
import { PuzzleFieldComponent } from './puzzle-field/puzzle-field.component';
import { PuzzlesBlockComponent } from './puzzles-block/puzzles-block.component';
import { PuzzleGameCardsDataService } from './services/puzzle-game-cards-data.service';
import { Level } from './interfaces/level-data.interface';

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
    // 2) indicate if a sentence is not completed correctly
    // 3) show an image if the sentence is correctly completed (???)
  }

  isCorrectlyCompleted() {
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

  showNextWordsSet(level: number, round: number, sentenceNum: number) {
    this.isCorrect.update(() => true);
    this.puzzlesDataService.getWordsData(level, round, sentenceNum)
      .subscribe((data) => {
        this.sourceWords = data;
      });
    this.isCorrect.update(() => false);
  }

  continue() {
    this.sentenceNumber.update((value) => value + 1);
    console.log(this.isCorrect());

    this.puzzlesDataService.getCardsData(this.level()).subscribe((data) =>{
      // const card = data.rounds[this.round()].words[this.sentenceNumber()];
      const roundsNum = data.rounds.length - 1;
      console.log(data.rounds.length);
      //
      const expr = true || false;
      switch(expr) {
        case (this.sentenceNumber() <= 9):
          this.showNextWordsSet(this.level(), this.round(), this.sentenceNumber());
          console.log('Continue button', this.isCorrect());
          break;
        case (this.sentenceNumber() > 9 && roundsNum > this.round()):
          this.round.update((value) => value + 1);
          this.correctSentences.update((value) => value = []);
          this.sentenceNumber.update((value) => value = 0);

          this.showNextWordsSet(this.level(), this.round(), this.sentenceNumber());
          console.log(this.isCorrect(), 'New Round', this.round(), this.sentenceNumber());
          break;
        case roundsNum === this.round():
            this.round.update((value) => value = 0);
            this.level.update((value) => value + 1);
            this.correctSentences.update((value) => value = []);
            this.sentenceNumber.update((value) => value = 0);

            this.showNextWordsSet(this.level(), this.round(), this.sentenceNumber());
            console.log(this.isCorrect(), 'New Level', this.round(), this.sentenceNumber());
            break;
          default:
            console.log('Win!');

      }
      //

      // if (this.sentenceNumber() <= 9) {
      //   this.showNextWordsSet(this.level(), this.round(), this.sentenceNumber());
      //   console.log('Continue button', this.isCorrect());
      // } else {
      //   if (this.sentenceNumber() > 9 && roundsNum > this.round()) {
      //     this.round.update((value) => value + 1);
      //     this.correctSentences.update((value) => value = []);
      //     this.sentenceNumber.update((value) => value = 0);

      //     this.showNextWordsSet(this.level(), this.round(), this.sentenceNumber());
      //     console.log(this.isCorrect(), 'New Round', this.round(), this.sentenceNumber());
      //   } else {
      //     if (roundsNum === this.round()) {
      //       this.round.update((value) => value = 0);
      //       this.level.update((value) => value + 1);
      //       this.correctSentences.update((value) => value = []);
      //       this.sentenceNumber.update((value) => value = 0);

      //       this.showNextWordsSet(this.level(), this.round(), this.sentenceNumber());
      //       console.log(this.isCorrect(), 'New Level', this.round(), this.sentenceNumber());
      //     } else {
      //       console.log('Win!');
      //     }
      //   }
      // }
    });
    this.puzzlesDataService.resultPuzzles$.next([]);
    this.isCorrect.update(() => false);
    console.log('Continue button works');
  }

  completeSentence() {
    if(!this.isCorrect()) {
      this.correctSentences.update((value) => {
        value.push(this.currentSentence());
        return value;
      })
      this.puzzlesDataService.sourcePuzzles$.next([]);
      this.isCorrect.update(() => true);
    } else {
      console.log('No word in source block'); // to delete
    }
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
