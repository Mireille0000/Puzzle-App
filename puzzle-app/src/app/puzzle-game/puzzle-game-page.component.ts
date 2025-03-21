import {
  Component, computed, inject, OnInit, signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NavigationService } from '../core/navigation.service';
import { HintsBlockComponent } from './hints-block/hints-block.component';
import { PuzzleFieldComponent } from './puzzle-field/puzzle-field.component';
import { PuzzlesBlockComponent } from './puzzles-block/puzzles-block.component';
import { LevelsAndRoundsComponent } from './levels-and-rounds/levels-and-rounds.component';
import { PuzzleGameCardsDataService } from './services/puzzle-game-cards-data.service';
import PuzzleData from './interfaces/puzzle-data.interface';

@Component({
  selector: 'app-puzzle-game-page',
  imports: [
    HintsBlockComponent,
    PuzzleFieldComponent,
    PuzzlesBlockComponent,
    LevelsAndRoundsComponent,
  ],
  templateUrl: './puzzle-game-page.component.html',
  styleUrl: './puzzle-game-page.component.scss',
})
export class PuzzleGamePageComponent implements OnInit {
  private navigation = inject(NavigationService);

  private route = inject(ActivatedRoute);

  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  currentSentence = signal<string[]>(['']);

  level = signal<number>(1);

  round = signal<number>(0);

  sentenceNumber = signal<number>(0);

  currentImageHint = signal<string>('');

  puzzleImagePath = signal<string>('');

  isCorrect = signal<boolean>(false);

  isDisabled = signal<boolean>(true);

  completedSentence: string[] = [];

  sourceWords: PuzzleData[] = [];

  correctSentences = signal<string[][]>([]);

  isCorrectWordsOrder = signal<boolean>(false);

  bgPositionTop = signal<number>(0);

  girdTemplateRowsPuzzle = signal<string>('');

  levelsNum = signal<Array<{value: number, option: number}>>([{ value: 0, option: 1 }]); // ??

  roundsPerLevel = signal<Array<{value: number, option: number}>>([{ value: 0, option: 1 }]);

  form = signal<FormGroup>(new FormGroup({}));

  ngOnInit(): void {
    this.navigation.getPathName(this.route);
    this.currentSentence = this.puzzlesDataService.currentSentence;
    this.correctSentences = this.puzzlesDataService.correctSentences;

    this.level = this.puzzlesDataService.level;
    this.round = this.puzzlesDataService.round;
    this.sentenceNumber = this.puzzlesDataService.sentenceNumber;

    this.isCorrect = this.puzzlesDataService.isCorrect; // naming
    this.isDisabled = this.puzzlesDataService.isDisabled;
    this.isCorrectWordsOrder = this.puzzlesDataService.isCorrectWordsOrder; // naming

    this.bgPositionTop = this.puzzlesDataService.bgPositonTop;
    this.girdTemplateRowsPuzzle = this.puzzlesDataService.girdTemplateRowsPuzzle;

    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      const sentence = data.reduce((acc: string[], item) => {
        acc.push(item.word);
        return acc;
      }, []);
      this.completedSentence = sentence;
    });
    this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
      this.sourceWords = data;
    });
  }

  isCorrectlyCompleted() {
    const sentence = computed(() => this.currentSentence().toString());

    if (sentence() === this.completedSentence.join()) {
      if (this.bgPositionTop() < 600) {
        this.bgPositionTop.update((value) => value + 60);
      } else {
        this.bgPositionTop.update((value) => {
          let newValue = value;
          newValue = 0;
          return newValue;
        });
      }
      this.girdTemplateRowsPuzzle.update(() => this.currentSentence().map(() => '1fr').join(' '));

      this.isCorrectWordsOrder.update(() => false);
      this.isCorrect.update(() => true);
      this.correctSentences.update((value) => {
        value.push(this.currentSentence());
        return value;
      });
    } else {
      this.isCorrectWordsOrder.update(() => true);
      this.isCorrect.update(() => false);
    }
  }

  downloadNewImage(level: number, round: number, sentenceNum: number) {
    this.isCorrect.update(() => true);
    this.puzzlesDataService.getWordsData(level, round, sentenceNum)
      .subscribe(() => {
        this.currentImageHint = this.puzzlesDataService.imageHint;
        this.puzzlesDataService.getImageFile(this.currentImageHint()).subscribe((data) => {
          this.puzzleImagePath = data;
        });
      });
    this.isCorrect.update(() => false);
  }

  showNextWordsSet(level: number, round: number, sentenceNum: number) {
    this.isCorrect.update(() => true);
    this.puzzlesDataService.getWordsData(level, round, sentenceNum)
      .subscribe((data) => {
        this.sourceWords = data;
      });
    this.isCorrect.update(() => false);
  }

  updateRoundsPerLevelArr(level: number) {
    this.puzzlesDataService.getLevelData(level).subscribe(() => {
      this.roundsPerLevel = this.puzzlesDataService.roundsPerLevel;
      this.roundsPerLevel.update(() => this.puzzlesDataService.roundsPerLevel());

      this.form = this.puzzlesDataService.form;
      this.form().get('round')?.setValue(this.roundsPerLevel()[this.round()]);
    });
  }

  continue() {
    this.sentenceNumber.update((value) => value + 1);
    this.isDisabled.update(() => true);

    this.puzzlesDataService.getLevelData(this.level()).subscribe((data) => {
      const roundsNum = data.rounds.length - 1;
      const expr = true || false;
      switch (expr) {
        case (this.sentenceNumber() <= 9):
          this.showNextWordsSet(this.level(), this.round(), this.sentenceNumber());
          break;
        case (this.sentenceNumber() > 9 && roundsNum > this.round()):
          this.round.update((value) => value + 1);
          this.correctSentences.update((value) => {
            let newValue = [...value];
            newValue = [];
            return newValue;
          });
          this.sentenceNumber.update((value) => {
            let newValue = value;
            newValue = 0;
            return newValue;
          });

          this.updateRoundsPerLevelArr(this.level());
          this.showNextWordsSet(this.level(), this.round(), this.sentenceNumber());
          this.downloadNewImage(this.level(), this.round(), this.sentenceNumber());
          this.puzzlesDataService
          .getLocalStorageProgressData(
            {level: this.level(), roundIndex: this.round()}
          );
          console.log(`Round ${this.round()} is completed!`); // local storage
          console.log(this.isCorrect(), 'New Round', this.round(), this.sentenceNumber());
          break;
        case (roundsNum === this.round() && this.level() < 6):
          this.round.update((value) => {
            let newValue = value;
            newValue = 0;
            return newValue;
          });
          this.level.update((value) => value + 1);
          this.correctSentences.update((value) => {
            let newValue = [...value];
            newValue = [];
            return newValue;
          });
          this.sentenceNumber.update((value) => {
            let newValue = value;
            newValue = 0;
            return newValue;
          });

          this.updateRoundsPerLevelArr(this.level());
          this.showNextWordsSet(this.level(), this.round(), this.sentenceNumber());
          this.downloadNewImage(this.level(), this.round(), this.sentenceNumber());
          this.puzzlesDataService
          .getLocalStorageProgressData(
            {level: this.level(), roundIndex: this.round()}
          );

          console.log(this.isCorrect(), 'New Level', this.level(), this.round(), this.sentenceNumber());
          break;
        default:
          console.log('Level', this.level(), 'Round', this.round(), 'Sentence', this.sentenceNumber());
          console.log('Win!');
      }
    });
    this.puzzlesDataService.resultPuzzles$.next([]);
    this.isCorrect.update(() => false);
  }

  completeSentence() {
    if (!this.isCorrect() && this.sentenceNumber() < 10) {
      if (this.bgPositionTop() >= 540) {
        this.bgPositionTop.update((value) => {
          let newValue = value;
          newValue = 0;
          return newValue;
        });
      } else {
        this.bgPositionTop.update((value) => {
          let newValue = value;
          newValue += 60;
          return newValue;
        });
      }
      this.girdTemplateRowsPuzzle.update(() => this.currentSentence().map(() => '1fr').join(' '));
      this.correctSentences.update((value) => {
        value.push(this.currentSentence());
        return value;
      });
      this.puzzlesDataService.sourcePuzzles$.next([]);
      this.isCorrect.update(() => true);
    } else {
      console.log('No word in source block'); // to delete
    }
  }
}
