import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';

interface ApplianceData {
  name: string;
  icon: string;
  kWh: number;
  color: string;
  percent: number;
}

@Component({
  selector: 'app-consumption-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    CardModule,
    TagModule,
    ProgressBarModule,
    TooltipModule,
    KnobModule,
  ],
  templateUrl: "./consumption-dashboard.html",
  styleUrl:"./consumption-dashboard.css" ,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsumptionDashboardComponent implements OnInit, OnDestroy {
  // ── Raw data ──
  totalConsumption = 37.782;
  solarKWh = 13.0;
  netGrid = 24.782;
  monthlyBill = 89.22;

  // ── Animated counters ──
  displayConsumption = 0;
  displaySolar = 0;
  displayGrid = 0;
  consumptionPct = 0;

  solarCoverageKnob = 0;
  private targetCoverage = Math.round((13.0 / 37.782) * 100); // 34

  appliances: ApplianceData[] = [
    { name: 'Air Conditioner', icon: '❄️', kWh: 20.0,  color: '#0ea5e9', percent: 0 },
    { name: 'Ceiling Fans',    icon: '🌀', kWh: 3.9,   color: '#6366f1', percent: 0 },
    { name: 'Computer',        icon: '💻', kWh: 3.6,   color: '#8b5cf6', percent: 0 },
    { name: 'Water Heater',    icon: '🚿', kWh: 3.0,   color: '#f43f5e', percent: 0 },
    { name: 'Dishwasher',      icon: '🍽️', kWh: 1.929, color: '#10b981', percent: 0 },
    { name: 'Refrigerator',    icon: '🧊', kWh: 1.782, color: '#06b6d4', percent: 0 },
    { name: 'Washing Machine', icon: '🫧', kWh: 1.671, color: '#f59e0b', percent: 0 },
    { name: 'Microwave',       icon: '📡', kWh: 1.2,   color: '#ec4899', percent: 0 },
    { name: 'Television',      icon: '📺', kWh: 0.7,   color: '#84cc16', percent: 0 },
  ];

  assumptions = [
    'AC: 1.8 kW for 1-star, −0.2 kW per extra star',
    'Ceiling fans: 65 W each, 15 h/day',
    'Water heater: 1.2–3.0 kW scaled by tank size',
    'Refrigerator: 0.9 kWh/100 L for 1-star',
    'Microwave: 1.2 kW × 1 h/day',
    'Dishwasher: 1.5 kWh/cycle',
    'Washing machine: 1.3 kWh/cycle (Top Load)',
    'TV: estimated by screen size + usage hours',
    'Computer: 120 W per unit',
    'Peak sun hours: 6.5 (Hot & Dry zone)',
    'Solar capacity: 2.0 kWp → 13.0 kWh/day',
  ];

  // ── Chart data ──
  donutData: any = {};
  donutOptions: any = {};
  barData: any = {};
  barOptions: any = {};
  polarData: any = {};
  polarOptions: any = {};

  private animFrame: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.buildCharts();
    this.animateCounters();
  }

  ngOnDestroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  private buildCharts() {
    const colors = this.appliances.map(a => a.color);
    const labels = this.appliances.map(a => a.name);
    const values = this.appliances.map(a => a.kWh);

    // Donut
    this.donutData = {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderWidth: 2, borderColor: 'var(--p-surface-ground, #0f0f13)', hoverOffset: 8 }],
    };
    this.donutOptions = {
      cutout: '72%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.raw} kWh` } } },
      animation: { duration: 1200, easing: 'easeInOutQuart' },
    };

    // Bar
    this.barData = {
      labels: this.appliances.map(a => a.name.split(' ')[0]),
      datasets: [{
        label: 'kWh/day',
        data: values,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
      }],
    };
    this.barOptions = {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: 'var(--p-text-muted-color, #64748b)', font: { size: 11 } }, grid: { color: 'var(--p-surface-border, rgba(255,255,255,.05))' } },
        y: { ticks: { color: 'var(--p-text-secondary-color, #94a3b8)', font: { size: 11 } }, grid: { display: false } },
      },
      animation: { duration: 1400, easing: 'easeOutBounce' },
    };

    // Polar
    this.polarData = {
      labels: ['Solar', 'Grid'],
      datasets: [{ data: [13.0, 24.782], backgroundColor: ['#f59e0bcc', '#0ea5e9cc'], borderWidth: 0 }],
    };
    this.polarOptions = {
      plugins: { legend: { labels: { color: 'var(--p-text-secondary-color, #94a3b8)', font: { size: 12 } } } },
      scales: { r: { ticks: { display: false }, grid: { color: 'var(--p-surface-border, rgba(255,255,255,.05))' } } },
      animation: { duration: 1200 },
    };
  }

  private animateCounters() {
    const duration = 1600;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);

      this.displayConsumption = ease * this.totalConsumption;
      this.displaySolar       = ease * this.solarKWh;
      this.displayGrid        = ease * this.netGrid;
      this.consumptionPct     = ease * 75;
      this.solarCoverageKnob  = Math.round(ease * this.targetCoverage);

      // Animate appliance bars
      this.appliances.forEach(a => {
        a.percent = ease * (a.kWh / this.totalConsumption) * 100;
      });

      this.cdr.markForCheck();
      if (t < 1) this.animFrame = requestAnimationFrame(step);
    };

    this.animFrame = requestAnimationFrame(step);
  }
}