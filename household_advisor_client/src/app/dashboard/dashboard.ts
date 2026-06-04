import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ProfileData } from '../profile-data/profile-data';

@Component({
  selector: 'app-dashboard',
  imports: [AccordionModule, ProfileData],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true
})
export class Dashboard {
  acc_activeTabs: string[] = ['0'];
  acc_disabled: boolean = false;
}
