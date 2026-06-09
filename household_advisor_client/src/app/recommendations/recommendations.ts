import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RecommendationItem {
  title: string;
  description: string;
  estimated_monthly_kwh_savings: number;
  estimated_monthly_cost_savings: number;
  implementation_cost: number;
  priority: 'High' | 'Medium' | 'Low' | string;
  confidence_score: number;
}

export interface RecommendationsData {
  recommendations: RecommendationItem[];
}

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendations.html',
  styleUrls: ['./recommendations.css'],
})
export class RecommendationsComponent implements OnInit, OnChanges {
  @Input() data!: RecommendationsData | null;

  // Stored KPI aggregates computed on initialization
  totalKwhSavings = 0;
  totalCostSavings = 0;

  ngOnInit() {
    this.calculateMetrics();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].isFirstChange()) {
      this.calculateMetrics();
    }
  }

  private calculateMetrics() {
    if (!this.data || !this.data.recommendations) return;
      console.log('Recommen', this.data);
    this.totalKwhSavings = this.data.recommendations.reduce(
      (sum, item) => sum + item.estimated_monthly_kwh_savings, 0
    );
    this.totalCostSavings = this.data.recommendations.reduce(
      (sum, item) => sum + item.estimated_monthly_cost_savings, 0
    );
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-amber-100 text-amber-900 border-amber-200/60';
      case 'medium':
        return 'bg-orange-50 text-orange-800 border-orange-100';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200/50';
    }
  }
}