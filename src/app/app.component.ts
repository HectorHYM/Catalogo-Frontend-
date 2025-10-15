import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SHARED_COMPONENTS } from '@shared/shared-components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ...SHARED_COMPONENTS],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'catalogo';
}
