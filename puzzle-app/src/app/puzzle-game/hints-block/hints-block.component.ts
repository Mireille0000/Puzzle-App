import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';

@Component({
  selector: 'pzl-hints-block',
  imports: [],
  templateUrl: './hints-block.component.html',
  styleUrl: './hints-block.component.scss',
})
export class HintsBlockComponent implements OnInit {
  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  level = signal<number>(1);

  round = signal<number>(0);

  isCorrect = signal<boolean>(false);

  sentenceNumber!: WritableSignal<number>;

  isClickedTranslationHint = false;

  levelData = {};

  currentSentenceTranslation = signal<string>('');

  ngOnInit(): void {
    this.level = this.puzzlesDataService.level;
    this.round = this.puzzlesDataService.round;
    this.sentenceNumber = this.puzzlesDataService.sentenceNumber;

    this.isCorrect = this.puzzlesDataService.isCorrect;

    this.puzzlesDataService.getCardsData(this.level()).subscribe((data) => {
      this.currentSentenceTranslation = this.puzzlesDataService.sentenceTranslation;
      console.log(data.rounds[this.round()].levelData);
    });
  }

  toggleCurrentSentenceTranslation() {
    this.isClickedTranslationHint = !this.isClickedTranslationHint;
    this.puzzlesDataService.getCardsData(this.level()).subscribe(() => {
      this.currentSentenceTranslation = this.puzzlesDataService.sentenceTranslation;
    });

    console.log(this.isClickedTranslationHint);
    console.log(this.currentSentenceTranslation());
    console.log(this.sentenceNumber());
  }

}
