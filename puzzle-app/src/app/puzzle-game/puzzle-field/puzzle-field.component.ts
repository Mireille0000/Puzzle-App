import {
  Component, inject, OnInit, signal,
} from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';
import { BackgroundColorDirective } from '../directives/add-background-color.directive';
import { BackgroundImageDirective } from '../directives/set-background-image.directive';
import { BackgroundPositionDirective } from '../directives/set-background-position.directive';
import PuzzleData from '../interfaces/puzzle-data.interface';
import { CanvasRendererDirective } from '../directives/canvas-renderer.directive';

@Component({
  selector: 'pzl-puzzle-field',
  imports: [
    NgFor,
    NgStyle,
    BackgroundColorDirective,
    BackgroundImageDirective,
    BackgroundPositionDirective,
    CanvasRendererDirective,
  ],
  templateUrl: './puzzle-field.component.html',
  styleUrl: './puzzle-field.component.scss',
})
export class PuzzleFieldComponent implements OnInit {
  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  sourceBlock: PuzzleData[] = [];

  resultBlock: PuzzleData[] = [];

  correctSentences = signal<string[][]>([]);

  level = signal<number>(1);

  round = signal<number>(0);

  currentSentenceNum = signal<number>(0);

  currentSentence = signal<string[]>(['']);

  currentImageHint = signal<string>('');

  backgroundImagePath = signal<string>('');

  isCorrect = signal<boolean>(false);

  isDisabled = signal<boolean>(true);

  isCorrectWordsOrder = signal<boolean>(false);

  isClickedImageHint = signal<boolean>(false);

  canSeeResults = signal<boolean>(false);

  bgPositionTop = '0'; // ??

  correctLineBgImage = signal<string>('');

  girdTemplateRowsPuzzle = signal<string>('');

  gameProgressData = signal<string>('');

  ngOnInit(): void {
    this.currentSentence = this.puzzlesDataService.currentSentence;
    this.correctSentences = this.puzzlesDataService.correctSentences;
    this.currentSentenceNum = this.puzzlesDataService.sentenceNumber;

    this.isCorrect = this.puzzlesDataService.isCorrect;
    this.isDisabled = this.puzzlesDataService.isDisabled;
    this.isCorrectWordsOrder = this.puzzlesDataService.isCorrectWordsOrder;
    this.isClickedImageHint = this.puzzlesDataService.isClikedImageHint;
    this.canSeeResults = this.puzzlesDataService.canSeeResults;

    this.backgroundImagePath = this.puzzlesDataService.backgroundImagePath;

    const currentGameProgressData = localStorage.getItem('currentProgress');
    this.gameProgressData = this.puzzlesDataService.gameProgressData;
    this.gameProgressData.update(() => currentGameProgressData as string);
    this.checkGameProgress();

    this.puzzlesDataService
      .getWordsData(this.level(), this.round(), this.currentSentenceNum())
      .subscribe(() => {
        this.currentImageHint = this.puzzlesDataService.imageHint;
        this.girdTemplateRowsPuzzle = this.puzzlesDataService.girdTemplateRowsPuzzle;

        this.puzzlesDataService.getImageFile(this.currentImageHint()).subscribe(() => {
          this.backgroundImagePath.update((value) => {
            let newValue = value;
            newValue = '';
            return newValue;
          });
          console.log(this.puzzlesDataService.correctLineBgImage());

          this.correctLineBgImage = this.puzzlesDataService.correctLineBgImage;
        });
      });

    this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
      this.sourceBlock = data;
    });

    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      this.resultBlock = data;
    });
  }

  checkGameProgress() {
    const parsedGameProgressData = JSON.parse(this.gameProgressData());

    if (localStorage.getItem('currentProgress')) {
      this.round.update(() => parsedGameProgressData.roundIndex);
      this.level.update(() => parsedGameProgressData.level);
    }
  }

  calculateBgPosition(index: number) {
    const bgPositions: { bgPosition: string }[] = [];
    const offset = 10 + (index * 50);

    bgPositions.push({ bgPosition: `top -${offset}px left` });
    this.bgPositionTop = `${offset}`;
    return bgPositions;
  }

  movePuzzles(index: number, puzzle: PuzzleData) {
    if (index !== -1) {
      this.puzzlesDataService
        .pushInSourceBlock(
          this.sourceBlock,
          this.resultBlock,
          puzzle,
          // this.currentSentence().length,
        );
    }
  }

  movePuzzleToPuzzlesBlock(puzzle: PuzzleData) {
    const { word } = puzzle;
    const puzzleIndex = this.resultBlock.findIndex((puzzleObj) => puzzleObj.word === word);

    if (this.isCorrect()) {
      this.resultBlock = [];
      this.movePuzzles(puzzleIndex, puzzle);
    } else {
      this.movePuzzles(puzzleIndex, puzzle);
    }

    if (this.sourceBlock.length === 0) {
      this.isDisabled.update(() => false);
    } else {
      this.isDisabled.update(() => true);
    }
  }
}
