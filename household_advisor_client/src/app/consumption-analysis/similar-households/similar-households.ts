import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

export interface HouseholdMatch {
  house_type: string;
  num_bedrooms: number;
  floor_area_sqft: number;
  num_occupants: number;
  climate_zone: string;
  city_tier: string;
  daily_energy_consumption_kWh: number;
  monthly_energy_consumption_kWh: number;
  similarity_distance: number;
  // UI-specific extensions
  isCurrentProfile?: boolean;
  displayName?: string;
}

export interface ComparisionSummary {
  comparison_columns: string[];
  similar_households_found: number;
  top_matches: HouseholdMatch[];
  peer_average_daily_kWh: number;
  peer_average_monthly_kWh: number;
  target_daily_kWh: number;
  target_monthly_kWh: number;
  daily_percentile: number;
  monthly_percentile: number;
  notes: string[];
}

@Component({
  selector: 'app-similar-households',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './similar-households.html',
  styleUrls: ['./similar-households.css'],
})
export class SimilarHouseholdsComponent implements OnInit, OnChanges {
  @Input() data!: ComparisionSummary |  null;

  tableRows: HouseholdMatch[] = [];
  chartData: any = {};
  chartOptions: any = {};

  ngOnInit() {
    this.initComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].isFirstChange()) {
      this.initComponent();
    }
  }

  private initComponent() {
    if (!this.data) return;
    this.buildTableRows();
    this.buildChart();
  }

  private buildTableRows() {
    // Construct the explicit Current Profile row using target consumption metrics
    const currentProfile: HouseholdMatch = {
      house_type: this.data?.top_matches[0]?.house_type || 'Apartment', 
      num_bedrooms: this.data?.top_matches[0]?.num_bedrooms || 2,
      floor_area_sqft: this.data?.top_matches[0]?.floor_area_sqft || 706.0,
      num_occupants: this.data?.top_matches[0]?.num_occupants || 3,
      climate_zone: this.data?.top_matches[0]?.climate_zone || 'Hot & Dry',
      city_tier: this.data?.top_matches[0]?.city_tier || 'Tier 3',
      daily_energy_consumption_kWh: this.data?.target_daily_kWh || 0,
      monthly_energy_consumption_kWh: this.data?.target_monthly_kWh || 0,
      similarity_distance: 0,
      isCurrentProfile: true,
      displayName: 'Your Profile'
    };

    const matches = this.data?.top_matches.map((match, i) => ({
      ...match,
      isCurrentProfile: false,
      displayName: `Match #${i + 1}`
    })) || []

    // Put your profile at the top of the grid to stand out cleanly
    this.tableRows = [currentProfile, ...matches];
  }

  private buildChart() {
    // Generate entities along the X-axis
    const labels = [...this.tableRows.map(r => r.displayName), 'Peer Average'];

    const dailyValues = [
      ...this.tableRows.map(r => r.daily_energy_consumption_kWh),
      this.data?.peer_average_daily_kWh || 0
    ];

    const monthlyValues = [
      ...this.tableRows.map(r => r.monthly_energy_consumption_kWh),
      this.data?.peer_average_monthly_kWh || 0
    ];

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Daily Consumption (kWh)',
          data: dailyValues,
          backgroundColor: labels.map(l => l === 'Your Profile' ? '#f59e0bb3' : '#fbbf244d'), 
          borderColor: labels.map(l => l === 'Your Profile' ? '#d97706' : '#f59e0b'),
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y'
        },
        {
          label: 'Monthly Consumption (kWh)',
          data: monthlyValues,
          backgroundColor: labels.map(l => l === 'Your Profile' ? '#475569b3' : '#cbd5e14d'),
          borderColor: labels.map(l => l === 'Your Profile' ? '#334155' : '#94a3b8'),
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y1'
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#1e293b',
          bodyColor: '#64748b',
          borderColor: '#f1f5f9',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (c: any) => `  ${c.dataset.label}: ${Number(c.raw).toLocaleString()} kWh`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8', font: { size: 10, family: 'Inter' } },
          grid: { display: false },
          border: { display: false }
        },
        y: {
          type: 'linear',
          position: 'left',
          ticks: { color: '#f59e0b', font: { size: 10, family: 'Inter' } },
          grid: { color: '#f8fafc' },
          border: { display: false }
        },
        y1: {
          type: 'linear',
          position: 'right',
          ticks: { color: '#64748b', font: { size: 10, family: 'Inter' } },
          grid: { display: false },
          border: { display: false }
        }
      },
      animation: { duration: 1200, easing: 'easeOutCubic' }
    };
  }
}