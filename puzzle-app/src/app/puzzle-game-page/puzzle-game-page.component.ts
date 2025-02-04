import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../core/navigation.service';

@Component({
  selector: 'app-puzzle-game-page',
  imports: [],
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
