import { Component, inject } from '@angular/core';
import { NavigationService } from '../core/navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-puzzle-game-page',
  imports: [],
  templateUrl: './puzzle-game-page.component.html',
  styleUrl: './puzzle-game-page.component.scss',
})
export class PuzzleGamePageComponent {
  private navigation = inject(NavigationService);
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
    this.navigation.getPathName(this.route);
  }
}
