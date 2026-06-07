import {
  Component, OnInit, OnDestroy, OnChanges, SimpleChanges,
  Input, ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

// ── Public input shapes (match the JSON from the API) ──────────────────────
export interface SolarScenario {
  capacity_kWp: number;
  annual_generation_kWh: number;
  annual_savings: number;
}

export interface SolarRoiData {
  scenarios: SolarScenario[];
  climate_zone: string;
  solar_peak_sun_hours: number;
  assumptions: string[];
}

// ── Internal view model ────────────────────────────────────────────────────
interface ScenarioVM extends SolarScenario {
  displaySavings: number;
  displayGen: number;
  monthlySavings: number;
  paybackYears: number;
  installCost: number;
}

@Component({
  selector: 'app-solar-roi',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: "./solar-roi.html",
  styleUrls:["./solar-roi.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarRoiComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data!: SolarRoiData;

  private readonly COST_PER_KWP = 50000;

  activeIdx = 1;
  vms: ScenarioVM[] = [];

  chartData: any = {}; chartOptions: any = {};
  lineData: any = {};  lineOptions: any = {};

  climateZone: string = "";
  solarPeakHours: number = 0

  private animFrame: any;
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit()    { this.init(); }
  ngOnChanges(changes: SimpleChanges) { if (changes['data']) this.init(); }
  ngOnDestroy() { if (this.animFrame) cancelAnimationFrame(this.animFrame); }

  cardLabel(i: number) {
    if (this.vms.length === 1) return 'Only';
    if (this.vms.length === 2) return i === 0 ? 'Basic' : 'Expanded';
    return i === 0 ? 'Starter' : i === 1 ? 'Recommended' : 'Maximum';
  }

  paybackPct(years: number) { return Math.min((years / 25) * 100, 100); }

  private init() {
    if (!this.data?.scenarios?.length) return;

    // Build view models with derived fields, display counters start at 0
    this.vms = this.data.scenarios.map(s => ({
      ...s,
      displaySavings: 0,
      displayGen:     0,
      monthlySavings: +(s.annual_savings / 12),
      installCost:    s.capacity_kWp * this.COST_PER_KWP,
      paybackYears:   +(s.capacity_kWp * this.COST_PER_KWP / s.annual_savings).toFixed(1),
    }));

    // Default active to middle scenario
    this.activeIdx = Math.floor(this.vms.length / 2);

    this.climateZone = this.data.climate_zone || 'Hot & Dry';
    this.solarPeakHours = this.data.solar_peak_sun_hours || 6.5;

    this.buildCharts();
    this.animateCounters();
  }

  private buildCharts() {
    const labels = this.vms.map(s => `${s.capacity_kWp} kWp`);

    const tooltip = {
      backgroundColor: '#fff', titleColor: '#1e293b', bodyColor: '#64748b',
      borderColor: '#f1f5f9', borderWidth: 1, padding: 10, cornerRadius: 8,
    };

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Annual Savings (₹)',
          data: this.vms.map(s => s.annual_savings),
          backgroundColor: '#fbbf24cc', borderColor: '#f59e0b',
          borderWidth: 1.5, borderRadius: 5, borderSkipped: false,
        },
        {
          label: 'Generation (kWh)',
          data: this.vms.map(s => s.annual_generation_kWh),
          backgroundColor: '#cbd5e1cc', borderColor: '#94a3b8',
          borderWidth: 1.5, borderRadius: 5, borderSkipped: false,
        },
      ],
    };
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltip, callbacks: { label: (c: any) => `  ${c.dataset.label}: ${Number(c.raw).toLocaleString()}` } },
      },
      scales: {
        x: { ticks: { color: '#94a3b8', font: { size: 11, family: 'Inter' } }, grid: { display: false }, border: { display: false } },
        y: { ticks: { color: '#cbd5e1', font: { size: 10, family: 'Inter' } }, grid: { color: '#f8fafc' }, border: { display: false } },
      },
      animation: { duration: 1100, easing: 'easeOutCubic' },
    };

    const years = Array.from({ length: 11 }, (_, i) => `Y${i}`);
    const lineColors = ['#94a3b8', '#f59e0b', '#64748b', '#fbbf24', '#cbd5e1'];
    this.lineData = {
      labels: years,
      datasets: this.vms.map((s, i) => ({
        label: `${s.capacity_kWp} kWp`,
        data: years.map((_, y) => +(s.annual_savings * y - s.installCost).toFixed(0)),
        borderColor:     lineColors[i % lineColors.length],
        backgroundColor: i === this.activeIdx ? '#fbbf2415' : 'transparent',
        borderWidth: i === this.activeIdx ? 2.5 : 1.5,
        pointRadius: 0, pointHoverRadius: 4,
        tension: 0.4,
        fill: i === this.activeIdx,
      })),
    };
    this.lineOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', font: { size: 11, family: 'Inter' }, boxWidth: 12, boxHeight: 2, padding: 16, usePointStyle: true, pointStyle: 'line' },
        },
        tooltip: { ...tooltip, callbacks: { label: (c: any) => `  ${c.dataset.label}: ₹${Number(c.raw).toLocaleString()}` } },
      },
      scales: {
        x: { ticks: { color: '#cbd5e1', font: { size: 10, family: 'Inter' } }, grid: { display: false }, border: { display: false } },
        y: {
          ticks: { color: '#cbd5e1', font: { size: 10, family: 'Inter' }, callback: (v: any) => `₹${(v / 1000).toFixed(0)}k` },
          grid: { color: '#f8fafc' }, border: { display: false },
        },
      },
      animation: { duration: 1200, easing: 'easeOutCubic' },
    };
  }

  private animateCounters() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const duration = 1400;
    const start = performance.now();
    const targets = this.vms.map(s => ({ savings: s.annual_savings, gen: s.annual_generation_kWh }));
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 4);
      this.vms.forEach((s, i) => {
        s.displaySavings = e * targets[i].savings;
        s.displayGen     = e * targets[i].gen;
      });
      this.cdr.markForCheck();
      if (t < 1) this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  }
}