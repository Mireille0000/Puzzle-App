import {
  Component, inject, OnInit, signal
} from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';
import { BackgroundColorDirective } from '../directives/add-background-color.directive';
import { BackgroundImageDirective } from '../directives/set-background-image.directive';
import { BackgroundPositionDirective } from '../directives/set-background-position.directive';
import PuzzleData from '../interfaces/puzzle-data.interface';

@Component({
  selector: 'pzl-puzzle-field',
  imports: [
    NgFor,
    NgStyle,
    BackgroundColorDirective,
    BackgroundImageDirective,
    BackgroundPositionDirective
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

  bgPositionTop = '0'; // ??

  correctLineBgImage = signal<string>('');

  girdTemplateRowsPuzzle = signal<string>('');

  ngOnInit(): void {
    this.currentSentence = this.puzzlesDataService.currentSentence;
    this.correctSentences = this.puzzlesDataService.correctSentences;
    this.currentSentenceNum = this.puzzlesDataService.sentenceNumber;

    this.isCorrect = this.puzzlesDataService.isCorrect;
    this.isDisabled = this.puzzlesDataService.isDisabled;
    this.isCorrectWordsOrder = this.puzzlesDataService.isCorrectWordsOrder;
    this.isClickedImageHint = this.puzzlesDataService.isClikedImageHint;

    this.backgroundImagePath = this.puzzlesDataService.backgroundImagePath;
    console.log(this.backgroundImagePath());

    this.puzzlesDataService.getWordsData(this.level(), this.round(), this.currentSentenceNum()).subscribe((data) => {
      this.currentImageHint = this.puzzlesDataService.imageHint;
      this.girdTemplateRowsPuzzle = this.puzzlesDataService.girdTemplateRowsPuzzle;

      this.puzzlesDataService.getImageFile(this.currentImageHint()).subscribe(() => {
        this.backgroundImagePath.update((value) => value = '');
        this.correctLineBgImage = this.puzzlesDataService.correctLineBgImage;
      })
    });

    this.puzzlesDataService.sourcePuzzles$.subscribe((data) => {
      this.sourceBlock = data;
    });

    this.puzzlesDataService.resultPuzzles$.subscribe((data) => {
      this.resultBlock = data;
    });
  }

  calculateBgPosition(index: number) {
    const bgPositions: { bgPosition: string }[] = [];
    const offset = index * 60;

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
          this.currentSentence().length,
        );
    }
  }

  movePuzzleToPuzzlesBlock(puzzle: PuzzleData) {
    const word = puzzle.word;
    const puzzleIndex = this.resultBlock.findIndex((puzzle) => puzzle.word === word);
    console.log(puzzleIndex);
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

    console.log(this.isDisabled(), this.sourceBlock);

    // console.log(`source block, puzzle field ${this.sourceBlock}`);
    // console.log(`results, puzzle field component ${this.resultBlock}`);
  }
}
