import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../core/navigation.service';
import { HintsBlockComponent } from './hints-block/hints-block.component';
import { PuzzleFieldComponent } from './puzzle-field/puzzle-field.component';
import { PuzzlesBlockComponent } from './puzzles-block/puzzles-block.component';
import { PuzzleGameCardsDataService } from './services/puzzle-game-cards-data.service';
import { NgFor } from '@angular/common';

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

  line: string[] = [];


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

    // change a sentence in source block when after clicking on 'check' button if 1) source block is empty
    // 2) result sentence is equal to currentSentence
  }

  changeSentence() {
    const sentence = computed(() => {
      return this.currentSentence().toString();
    })

    if (sentence() === this.completedSentence.join() && this.sentenceNumber() <= 9) {
      this.sentenceNumber.update((value) => value + 1);
      this.isCorrect.update(() => true);
      this.correctSentences.update((value) => {
        value.push(this.currentSentence());
        return value;
      })

      console.log(this.sentenceNumber())
      this.puzzlesDataService.getCardsData(this.level()).subscribe((data) =>{
        const card = data.rounds[this.round()].words[this.sentenceNumber()];
        if (card) {
          this.puzzlesDataService.getWordsData(this.level(), this.round(), this.sentenceNumber())
            .subscribe((data) => {
              this.sourceWords = data;
            })
          this.sentencesInRound = card.textExample; // to delete
        } else {
          this.isCorrect.update(() => false);
          console.log(this.isCorrect(), 'New Round');
        }
        console.log('Testing', this.sentencesInRound); // to delete
      }
      ) //async
      console.log('Correct', this.isCorrect());
    } else {
      this.isCorrect.update(() => false);
      console.log(this.isCorrect(), this.sentenceNumber(), 'Try again');
    }
  }
}
