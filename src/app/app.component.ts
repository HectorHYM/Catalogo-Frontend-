import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ...SHARED_IMPORTS],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'catalogo';
}
