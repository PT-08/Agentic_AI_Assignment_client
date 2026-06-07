import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { ConsumptionDashboardComponent} from './consumption-dashboard/consumption-dashboard'

@Component({
  selector: 'app-consumption-analysis',
  imports: [ConsumptionDashboardComponent],
  templateUrl: './consumption-analysis.html',
  styleUrl: './consumption-analysis.css',
  providers: [AppService]
})
export class ConsumptionAnalysis {}
