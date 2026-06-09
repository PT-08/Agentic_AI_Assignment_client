import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';

export interface ConsumptionData {
  "energy_breakdown": Record<string, string | number>;
  "daily_energy_consumption_kWh": number;
  "adjusted_daily_energy_kWh": number
  "solar_generation_kWh_per_day": number;
  "solar_peak_sun_hours": number;
  "net_grid_draw_kWh_per_day": number;
  "monthly_grid_bill": number;
  "climate_zone": string
  "assumptions": Array<string>;
}

interface ApplianceData { name: string; kWh: number; percent: number; key: string; }

@Component({
  selector: 'app-consumption-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule],
  templateUrl: "./consumption-dashboard.html",
  styleUrls: ["./consumption-dashboard.css"],
})
export class ConsumptionDashboardComponent implements OnInit, OnDestroy {
  @Input() data: ConsumptionData | null = null;
  totalConsumption = 0;
  solarKWh = 0;
  netGrid = 0;
  monthlyBill = 0;
  climateZone = '';
  sunPeakHours = 0;

  displayConsumption = 0;
  displaySolar = 0;
  displayGrid = 0;
  displayBill = 0;
  consumptionPct = 0;
  solarCoverage = 0;

  // Two accent hues (amber + sky) + neutral slate steps for the rest
  private readonly palette = [
    '#0ea5e9', // sky-500   — AC (biggest)
    '#6366f1', // indigo-500
    '#8b5cf6', // violet-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
    '#ec4899', // pink-500
    '#84cc16', // lime-500
  ];


  appliances: ApplianceData[] = [
    { name: 'Air Conditioner', kWh: 20.0, percent: 0, key: "ac_kWh_per_day" },
    { name: 'Ceiling Fans', kWh: 3.9, percent: 0, key: "ceiling_fans_kWh_per_day" },
    { name: 'Computer', kWh: 3.6, percent: 0, key: "computer_kWh_per_day" },
    { name: 'Water Heater', kWh: 3.0, percent: 0, key: "water_heater_kWh_per_day" },
    { name: 'Dishwasher', kWh: 1.929, percent: 0, key: "dishwasher_kWh_per_day" },
    { name: 'Refrigerator', kWh: 1.782, percent: 0, key: "refrigerator_kWh_per_day" },
    { name: 'Washing Machine', kWh: 1.671, percent: 0, key: "washing_machine_kWh_per_day" },
    { name: 'Microwave', kWh: 1.2, percent: 0, key: "microwave_kWh_per_day" },
    { name: 'Television', kWh: 0.7, percent: 0, key: "tv_kWh_per_day" },
  ];

  getColor(item: ApplianceData) {
    return this.palette[this.appliances.indexOf(item) % this.palette.length];
  }

  assumptions: string[] = [];

  donutData: any = {}; donutOptions: any = {};
  barData: any = {}; barOptions: any = {};
  stackData: any = {}; stackOptions: any = {};

  private animFrame: any;
  constructor(private cdr: ChangeDetectorRef) { }
  ngOnInit() { this.parseData(); this.buildCharts(); this.animateCounters(); }
  ngOnChanges() { this.parseData(); this.buildCharts(); this.animateCounters(); }
  ngOnDestroy() { if (this.animFrame) cancelAnimationFrame(this.animFrame); }

  private parseData() {
    if (!!this.data) {
      this.assumptions = this.data.assumptions;
      this.totalConsumption = this.data.adjusted_daily_energy_kWh;
      this.solarKWh = this.data.solar_generation_kWh_per_day;
      this.netGrid = this.data.net_grid_draw_kWh_per_day;
      this.monthlyBill = this.data.monthly_grid_bill;
      this.climateZone = this.data.climate_zone || 'Hot & Dry'
      this.sunPeakHours = this.data.solar_peak_sun_hours;

      this.appliances.forEach(a => {
        const value = this.data?.energy_breakdown?.[a.key];
        const data = typeof value === 'number' ? value : 0;
        a.kWh = data ? data : a.kWh;
      })
    }
  }

  private buildCharts() {
    const labels = this.appliances.map(a => a.name);
    const values = this.appliances.map(a => a.kWh);
    const colors = this.appliances.map((_, i) => this.palette[i % this.palette.length]);
    // Soften bar colours slightly
    const barColors = colors.map(c => c + 'cc');

    const tooltip = {
      backgroundColor: '#fff',
      titleColor: '#1e293b',
      bodyColor: '#64748b',
      borderColor: '#f1f5f9',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
    };

    // Donut
    this.donutData = {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderWidth: 3, borderColor: '#f8fafc', hoverOffset: 5 }],
    };
    this.donutOptions = {
      cutout: '72%',
      plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: (c: any) => `  ${c.label}  ${c.raw} kWh` } } },
      animation: { duration: 1000, easing: 'easeInOutQuart' },
    };

    // Horizontal bar
    this.barData = {
      labels,
      datasets: [{ data: values, backgroundColor: barColors, borderWidth: 0, borderRadius: { topRight: 4, bottomRight: 4 }, borderSkipped: false }],
    };
    this.barOptions = {
      indexAxis: 'y', responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: (c: any) => `  ${c.raw} kWh/day` } } },
      scales: {
        x: { ticks: { color: '#cbd5e1', font: { size: 10, family: 'Inter' } }, grid: { color: '#f8fafc' }, border: { display: false } },
        y: { ticks: { color: '#64748b', font: { size: 11, family: 'Inter', weight: '500' }, padding: 8 }, grid: { display: false }, border: { display: false } },
      },
      animation: { duration: 1200, easing: 'easeOutCubic' },
    };

    // Stacked solar vs grid — amber + sky
    this.stackData = {
      labels: [''],
      datasets: [
        { label: 'Solar', data: [13.0], backgroundColor: '#f59e0b', borderWidth: 0, borderRadius: { topLeft: 4, bottomLeft: 4 }, borderSkipped: false },
        { label: 'Grid', data: [24.782], backgroundColor: '#bae6fd', borderWidth: 0, borderRadius: { topRight: 4, bottomRight: 4 }, borderSkipped: false },
      ],
    };
    this.stackOptions = {
      indexAxis: 'y', responsive: true,
      plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: (c: any) => `  ${c.dataset.label}  ${c.raw} kWh` } } },
      scales: {
        x: { stacked: true, display: false },
        y: { stacked: true, display: false },
      },
      animation: { duration: 1000 },
    };
  }

  private animateCounters() {
    const duration = 1600;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 4);
      this.displayConsumption = e * this.totalConsumption;
      this.displaySolar = e * this.solarKWh;
      this.displayGrid = e * this.netGrid;
      this.displayBill = e * this.monthlyBill;
      this.consumptionPct = e * 100;
      this.solarCoverage = Math.round(e * (this.solarKWh / this.totalConsumption) * 100);
      this.appliances.forEach(a => { a.percent = e * (a.kWh / this.totalConsumption) * 100; });
      this.cdr.markForCheck();
      if (t < 1) this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  }
}