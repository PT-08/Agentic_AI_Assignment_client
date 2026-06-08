import { Component, inject } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ProfileData } from '../profile-data/profile-data';
import { ConsumptionAnalysis } from '../consumption-analysis/consumption-analysis';
import { RecommendationItem, RecommendationsComponent, RecommendationsData } from '../recommendations/recommendations';
import { AppService } from '../app.service';

@Component({
  selector: 'app-dashboard',
  imports: [AccordionModule, ProfileData, ConsumptionAnalysis, RecommendationsComponent],
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

  ngOnInit() {
    this.profileData = this.appService.getProfileData();
    this.recommendationsData = this.appService.getRecommendationsData();
  }

  onProfileDataSubmit() {
    this.profileData = this.appService.getProfileData();
    this.appService.getRecommendations(this.profileData, (recommendationsData) => {
      this.recommendationsData = recommendationsData;
      this.acc_activeTabs = ['1', '2']; // Open all tabs when data is submitted
    });
  }
}
