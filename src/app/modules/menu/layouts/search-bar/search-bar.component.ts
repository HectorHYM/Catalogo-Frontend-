import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-search-bar',
  imports: [...SHARED_IMPORTS],
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

}
