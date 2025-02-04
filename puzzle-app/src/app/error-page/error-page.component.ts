import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../core/navigation.service';

@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent implements OnInit {
  private navigation = inject(NavigationService);

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.navigation.getPathName(this.route);
  }
}
