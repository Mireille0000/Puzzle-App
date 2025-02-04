import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../core/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent implements OnInit{
  private navigation = inject(NavigationService);
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
    this.navigation.getPathName(this.route);
  }
}
