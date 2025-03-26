import { CdkColumnDef } from '@angular/cdk/table';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { PuzzleGameCardsDataService } from '../puzzle-game/services/puzzle-game-cards-data.service';
import { RoundStatisticsData } from './interfaces/round-statistics-data';
import { delay } from 'rxjs';

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

  level = signal<number>(0); //

  round = 0;

  displayedColumns: string[] = [
    'sentence-number', 'sound', 'sentence', 'known-unknown'
  ];

  dataSource: RoundStatisticsData[] =[
  ];

  ngOnInit(): void {
    this.level = this.puzzlesDataService.level;
    this.round = +(localStorage.getItem('chosenRound') as string);

    this.puzzlesDataService.getRoundData(this.level(), this.round - 1).subscribe();
    this.puzzlesDataService.roundStatisticsData$.subscribe((data) => {
      this.dataSource = data;
      console.log(this.dataSource);
    })

    console.log(this.dataSource);
    // sentences of the round that was selected + or the round that has just been completed +-
    // is autocompletion  was applicated
    // get the round that has just been compelted+-
  }


  backToGame() {
    this.router.navigate(['/puzzle-game']);
    // return to the next round or level/round
  }

  listenAudio(id: number) {
    this.puzzlesDataService.getAudioFile(this.dataSource[id - 1].sound).pipe(delay(1000)).subscribe((data) => {
      data.play();
    })
  }

}
