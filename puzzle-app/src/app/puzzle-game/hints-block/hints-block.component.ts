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

  isClickedAudioHint = false;

  isClickedImageHint = signal<boolean>(false);

  currentSentenceTranslation = signal<string>('');

  currentAudioHint = signal<string>('');

  currentImageHint = signal<string>('');

  backgroundImagePath = signal<string>(''); // ???

  ngOnInit(): void {
    this.level = this.puzzlesDataService.level;
    this.round = this.puzzlesDataService.round;
    this.sentenceNumber = this.puzzlesDataService.sentenceNumber;

    this.isCorrect = this.puzzlesDataService.isCorrect;
    this.isClickedImageHint = this.puzzlesDataService.isClikedImageHint;

    this.puzzlesDataService.getWordsData(this.level(), this.round(), this.sentenceNumber()).subscribe((data) => {
      this.currentSentenceTranslation = this.puzzlesDataService.sentenceTranslation;
      this.currentAudioHint = this.puzzlesDataService.audioHint;
      this.currentImageHint = this.puzzlesDataService.imageHint;

      this.backgroundImagePath = this.puzzlesDataService.backgroundImagePath;
    });
  }

  toggleCurrentSentenceTranslation() {
    this.isClickedTranslationHint = !this.isClickedTranslationHint;
    this.currentSentenceTranslation = this.puzzlesDataService.sentenceTranslation;
  }

  toggleAudioHint() {
    // add toggle functionality?
    this.isClickedAudioHint = !this.isClickedAudioHint;
    this.currentAudioHint = this.puzzlesDataService.audioHint;
    this.puzzlesDataService.getAudioFile(this.currentAudioHint()).subscribe((data) => {
      const audioUrl = URL.createObjectURL(data);
      const audio = new Audio(audioUrl);
      audio.play();
    })
  }

  toggleImageHint() {
    this.puzzlesDataService.getImageFile(this.currentImageHint()).subscribe(() => {
       if(this.isClickedImageHint() === false) {
        this.isClickedImageHint.update(() => true);
        this.backgroundImagePath.update((value) => value = this.puzzlesDataService.backgroundImagePath());
      } else {
        this.isClickedImageHint.update(() => false);
        this.backgroundImagePath.update(() => '');
      }
    });
  }
}
