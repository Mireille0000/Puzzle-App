import { CdkColumnDef } from '@angular/cdk/table';
import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'pzl-statistics-page',
  imports: [MatTableModule],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
  providers: [CdkColumnDef]
})
export class StatisticsPageComponent {
  displayedColumns: string[] = [
    'sentence-number', 'sound', 'sentence', 'known-unknown'
  ];
  dataSource = [
    {sentenceNumber: 1, sound: 'mp3', sentence: '1.0079', knownUnknown: 'H'},
  ]

}
