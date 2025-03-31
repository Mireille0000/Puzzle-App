import { CdkColumnDef } from '@angular/cdk/table';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { PuzzleGameCardsDataService } from '../puzzle-game/services/puzzle-game-cards-data.service';
import { RoundStatisticsData } from './interfaces/round-statistics-data.interface';
import { delay } from 'rxjs';
import { PictureData } from './interfaces/picture-data.interface';
import PuzzleData from '../puzzle-game/interfaces/puzzle-data.interface';

@Component({
  selector: 'pzl-statistics-page',
  imports: [MatTableModule],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
  providers: [CdkColumnDef]
})
export class StatisticsPageComponent implements OnInit{
  private router = inject(Router);

  private puzzlesDataService = inject(PuzzleGameCardsDataService);

  currentLevel = signal<number>(0); //

  currentRound = signal<number>(0); //

  round = 0;

  level = 1;

  displayedColumns: string[] = [
    'sentence-number', 'sound', 'sentence', 'known-unknown'
  ];

  dataSource: RoundStatisticsData[] =[
  ];

  pictureData: PictureData = {author: '', title: '', year: '', image: ''}; //

  sourceBlock: PuzzleData [] = []

  ngOnInit(): void {
    this.currentLevel = this.puzzlesDataService.level;
    this.currentRound = this.puzzlesDataService.round; //

    this.round = localStorage.getItem('chosenRound') ?
      +(localStorage.getItem('chosenRound') as string) - 1 :
      0;
    this.level = localStorage.getItem('chosenLevel') ?
      +(localStorage.getItem('chosenLevel') as string) :
      1;

      console.log(this.level, this.round);
    this.puzzlesDataService.getRoundData(this.level, this.round).subscribe((data) => {
      console.log(data.levelData);
      this.pictureData = {author: data.levelData.author, title: data.levelData.name, year: data.levelData.year, image: ''};
      this.puzzlesDataService.getImageFile(data.levelData.cutSrc).subscribe((data) => {
        this.pictureData.image = data();
      });
    });
    this.puzzlesDataService.roundStatisticsData$.subscribe((data) => {
      this.dataSource = data;
    })

    console.log(this.round, this.currentRound());
    // is autocompletion  was applicated
  }


  backToGame() {
    this.router.navigate(['/puzzle-game']);
    this.puzzlesDataService.sentenceNumber.update(() => 0);
    this.puzzlesDataService.canSeeResults.update(() => false);
    this.puzzlesDataService.isCorrect.update(() => false);
    console.log(this.puzzlesDataService.sentenceNumber());
    // update round/level
  }

  listenAudio(id: number) {
    this.puzzlesDataService.getAudioFile(this.dataSource[id - 1].sound).pipe(delay(1000)).subscribe((data) => {
      data.play();
    })
  }

}
