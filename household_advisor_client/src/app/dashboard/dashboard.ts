import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ProfileData } from '../profile-data/profile-data';
import { ConsumptionAnalysis } from '../consumption-analysis/consumption-analysis';
import { RecommendationItem, RecommendationsComponent, RecommendationsData } from '../recommendations/recommendations';
import { AppService } from '../app.service';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay';

@Component({
  selector: 'app-dashboard',
  imports: [AccordionModule, ProfileData, ConsumptionAnalysis, RecommendationsComponent, LoadingOverlayComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
  providers: [AppService]
})
export class Dashboard {
  acc_activeTabs: string[] = ['0'];
  acc_disabled: boolean = false;
  recommendationsData: RecommendationsData = {
    recommendations: []
  }
  profileData: Record<string, any> = {};
  appService: AppService = inject(AppService);
  cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  loading: boolean = false;
  consumptionData: any = null

  ngOnInit() {
    this.profileData = this.appService.getProfileData();
    this.recommendationsData = this.appService.getRecommendationsData();
  }

  onProfileDataSubmit(payload: Record<string, any>) {
    this.profileData = this.appService.getProfileData();
    this.loading = true;
    this.appService.getRecommendations(payload, (data) => {
      this.consumptionData = { "energy_metrics": data['energy_metrics'], comparison_summary: data["comparison_summary"], "solar_roi": { ...data["solar_roi"], "solar_peak_sun_hours": data['energy_metrics'].solar_peak_sun_hours, "climate_zone": data["profile_data"].climate_zone } }
      this.recommendationsData = data['recommendations'];
      this.loading = false;
      Promise.resolve().then(() => {
        this.acc_activeTabs = ['1', '2']; // Open all tabs when data is submitted
        this.cdRef.detectChanges();
      });
    });
  }
}
