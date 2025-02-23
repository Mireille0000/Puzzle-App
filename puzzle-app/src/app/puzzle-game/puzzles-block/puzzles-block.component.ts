import { Component, inject, OnInit } from '@angular/core';
import { PuzzleGameCardsDataService } from '../services/puzzle-game-cards-data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'pzl-puzzles-block',
  imports: [NgFor],
  templateUrl: './puzzles-block.component.html',
  styleUrl: './puzzles-block.component.scss'
})
export class PuzzlesBlockComponent implements OnInit{
  words: string[] = [];
  private httpService = inject(PuzzleGameCardsDataService);

  ngOnInit(): void {
    this.randomizeWordsOrder()
  }

  randomizeWordsOrder() {
    this.httpService.getWordsData(1, 0, 0).subscribe((data) => {
      const currentWordsArr = data.split(' ');

      const reducedCurrentWordsArr: string[] = currentWordsArr.reduce((acc: string[], item, i) => {
        const randomNumber = this.getRandomInt(currentWordsArr.length);
        [acc[i], acc[randomNumber]] = [acc[randomNumber], acc[i]];
        return acc;
      }, currentWordsArr);

      this.words = reducedCurrentWordsArr.
          concat(currentWordsArr).
          filter((item, i, arr) => arr.indexOf(item) === i);
    })
  }

 getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
