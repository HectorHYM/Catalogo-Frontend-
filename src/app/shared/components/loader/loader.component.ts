import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '@core/services/loader.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  imports: [CommonModule, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  constructor(protected loaderService : LoaderService) { }
}
