import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../core/navigation.service';

@Component({
  selector: 'app-welcome-page',
  imports: [],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
  constructor(private navigation: NavigationService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.navigation.getPathName(this.route);
  }
}
