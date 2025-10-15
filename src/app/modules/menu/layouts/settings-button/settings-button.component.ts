import { Component, EventEmitter, Output } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-settings-button',
  imports: [...SHARED_IMPORTS],
  standalone: true,
  templateUrl: './settings-button.component.html',
  styleUrl: './settings-button.component.css'
})
export class SettingsButtonComponent {
  @Output() toggle = new EventEmitter<void>();
  onToggle() { this.toggle.emit(); }
}
