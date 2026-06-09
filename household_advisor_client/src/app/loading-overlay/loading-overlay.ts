import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './loading-overlay.html',
  styleUrls: ['./loading-overlay.css'],
})
export class LoadingOverlayComponent {
  // Controls whether the blocking backdrop is visible
  @Input() visible = false; 
  // Optional messaging to show below the indicator
  @Input() message = 'Analyzing structural profiles...'; 
}