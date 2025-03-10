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

  currentAudioHint = signal<string>('');

  ngOnInit(): void {
    this.level = this.puzzlesDataService.level;
    this.round = this.puzzlesDataService.round;
    this.sentenceNumber = this.puzzlesDataService.sentenceNumber;

    this.isCorrect = this.puzzlesDataService.isCorrect;

    this.puzzlesDataService.getWordsData(this.level(), this.round(), this.sentenceNumber()).subscribe((data) => {
      this.currentSentenceTranslation = this.puzzlesDataService.sentenceTranslation;
      this.currentAudioHint = this.puzzlesDataService.audioHint;
    });
  }

  toggleCurrentSentenceTranslation() {
    this.isClickedTranslationHint = !this.isClickedTranslationHint;
    this.puzzlesDataService.getWordsData(this.level(), this.round(), this.sentenceNumber()).subscribe(() => {
      this.currentSentenceTranslation = this.puzzlesDataService.sentenceTranslation;
    });

    console.log(this.isClickedTranslationHint);
    console.log(this.currentSentenceTranslation());
    console.log(this.sentenceNumber());
  }

  toggleAudioHint() {
    console.log('Audio Hint Works!');
    this.puzzlesDataService.getWordsData(this.level(), this.round(), this.sentenceNumber()).subscribe(() => {
      this.currentAudioHint = this.puzzlesDataService.audioHint;
      this.puzzlesDataService.getAudioFile(this.currentAudioHint()).subscribe((data) => {
        const audioUrl = URL.createObjectURL(data);
        const audio = new Audio(audioUrl);
        audio.play();
      })
      console.log(this.currentAudioHint());
    });
  }
}
