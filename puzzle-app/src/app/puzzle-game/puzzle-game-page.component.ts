import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../core/navigation.service';
import { HintsBlockComponent } from './hints-block/hints-block.component';
import { PuzzleFieldComponent } from './puzzle-field/puzzle-field.component';
import { PuzzlesBlockComponent } from './puzzles-block/puzzles-block.component';

@Component({
  selector: 'app-puzzle-game-page',
  imports: [HintsBlockComponent, PuzzleFieldComponent, PuzzlesBlockComponent],
  templateUrl: './puzzle-game-page.component.html',
  styleUrl: './puzzle-game-page.component.scss',
})
export class PuzzleGamePageComponent {
  private navigation = inject(NavigationService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.navigation.getPathName(this.route);
  }
}
