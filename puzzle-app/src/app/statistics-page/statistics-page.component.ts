import { CdkColumnDef } from '@angular/cdk/table';
import {
  Component, inject, OnInit, signal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { PuzzleGameCardsDataService } from '../puzzle-game/services/puzzle-game-cards-data.service';
import { RoundStatisticsData } from './interfaces/round-statistics-data.interface';
import { PictureData } from './interfaces/picture-data.interface';
import PuzzleData from '../puzzle-game/interfaces/puzzle-data.interface';

@Component({
  selector: 'pzl-statistics-page',
  imports: [MatTableModule],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
  providers: [CdkColumnDef],
})
export class StatisticsPageComponent implements OnInit {
  private router = inject(Router);

  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  currentLevel = signal<number>(0); //

  currentRound = signal<number>(0); //

  round = 0;

  level = 1;

  displayedColumns: string[] = [
    'sentence-number', 'sound', 'sentence', 'known-unknown',
  ];

  dataSource: RoundStatisticsData[] = [
  ];

  pictureData: PictureData = {
    author: '', name: '', year: '', image: '',
  }; //

  sourceBlock: PuzzleData [] = [];

  ngOnInit(): void {
    this.currentLevel = this.puzzlesDataService.level;
    this.currentRound = this.puzzlesDataService.round; //

    this.round = localStorage.getItem('chosenRound')
      ? +(localStorage.getItem('chosenRound') as string) - 1
      : 0;
    this.level = localStorage.getItem('chosenLevel')
      ? +(localStorage.getItem('chosenLevel') as string)
      : 1;

    this.puzzlesDataService.getRoundData(this.level, this.round).subscribe((data) => {
      this.pictureData = {
        author: data.levelData.author, name: data.levelData.name, year: data.levelData.year, image: '',
      };
      this.puzzlesDataService.getImageFile(data.levelData.cutSrc).subscribe((dataImage) => {
        this.pictureData.image = dataImage();
      });
    });

    this.puzzlesDataService.roundStatisticsData$.subscribe((data) => {
      const autocompletedSentencesLS = JSON.parse(localStorage.getItem('autocompletedSentencesStatistics') as string);
      const isAutocompletedCurrentArr = autocompletedSentencesLS[`level${this.currentLevel()}`][this.currentRound()][`round${this.currentRound()}`];
      localStorage.setItem('autocompletedSentencesStatistics', JSON.stringify(autocompletedSentencesLS));
      this.puzzlesDataService.isAutocomplitionUsedArr();

      const dataCopy = [...data];
      for (let i = 0; i < isAutocompletedCurrentArr.length; i += 1) {
        const item = isAutocompletedCurrentArr[i].sentenceNumber + 1;
        for (let j = 0; j < dataCopy.length; j += 1) {
          if (item === dataCopy[j].sentenceNumber) {
            dataCopy[j].knownUnknown = 'X';
          }
        }
      }
      this.dataSource = dataCopy;
    });
  }

  backToGame() {
    this.router.navigate(['/puzzle-game']);
    this.puzzlesDataService.sentenceNumber.update(() => 0);
    this.puzzlesDataService.canSeeResults.update(() => false);
    this.puzzlesDataService.isCorrect.update(() => false);

    this.puzzlesDataService.getLevelData(this.currentLevel()).subscribe((data) => {
      const roundsNum = data.rounds.length - 1;

      if (roundsNum === this.currentRound() && this.currentLevel() < 6) {
        this.currentRound.update((value) => {
          let newValue = value;
          newValue = 0;
          return newValue;
        });
        this.currentLevel.update((value) => value + 1);
      }
    });
  }

  listenAudio(id: number) {
    this.puzzlesDataService.getAudioFile(this.dataSource[id - 1].sound)
      .pipe(delay(1000))
      .subscribe((data) => {
        data.play();
      });
  }
}
