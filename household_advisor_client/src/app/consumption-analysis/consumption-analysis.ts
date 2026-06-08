import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { ConsumptionDashboardComponent, ConsumptionData } from './consumption-dashboard/consumption-dashboard';
import { SolarRoiComponent, SolarRoiData } from './solar-roi/solar-roi';
import { SimilarHouseholdsComponent, ComparisionSummary } from './similar-households/similar-households';


const solarRoiData: SolarRoiData = {
  "scenarios": [
    {
      "capacity_kWp": 1.0,
      "annual_generation_kWh": 2372.5,
      "annual_savings": 284.7
    },
    {
      "capacity_kWp": 3.0,
      "annual_generation_kWh": 7117.5,
      "annual_savings": 854.1
    },
    {
      "capacity_kWp": 5.0,
      "annual_generation_kWh": 11862.5,
      "annual_savings": 1423.5
    }
  ],
  climate_zone: 'Hot& Dry',
  solar_peak_sun_hours: 6.5,
  "assumptions": [
    "AC assumed 1.8 kW for 1-star and decreases by 0.2 kW per extra star.",
    "Ceiling fans assumed 65 W each, running 15 hours per day.",
    "Water heaters assumed 1.2-3.0 kW base power scaled by tank size.",
    "Refrigerators assumed 0.9 kWh per 100 L for 1-star ratings.",
    "Microwave assumed at 1.2 kW for one hour daily.",
    "Dishwasher assumed 1.5 kWh per cycle.",
    "Washing machine assumed 1.3 kWh per cycle for Top Load and 1.0 kWh otherwise.",
    "TV energy estimated by screen size band and daily usage hours.",
    "Computers assumed 120 W each while running.",
    "Assume peak sun hours = 6.5 for climate zone 'Hot & Dry'.",
    "Estimated solar generation = 13.0 kWh/day from 2.0 kWp capacity.",
    "Using peak sun hours = 6.5 for climate 'Hot & Dry'.",
    "Using base daily consumption = 37.782 kWh/day.",
    "Using existing solar capacity = 2.0 kWp -> est 13.0 kWh/day."
  ]
}

const consumptionData: ConsumptionData = {
  "energy_breakdown": {
    "ac_kWh_per_day": 20.0,
    "ceiling_fans_kWh_per_day": 3.9,
    "water_heater_kWh_per_day": 3.0,
    "refrigerator_kWh_per_day": 1.782,
    "microwave_kWh_per_day": 1.2,
    "dishwasher_kWh_per_day": 1.929,
    "washing_machine_kWh_per_day": 1.671,
    "tv_kWh_per_day": 0.7,
    "computer_kWh_per_day": 3.6
  },
  "daily_energy_consumption_kWh": 37.782,
  "solar_generation_kWh_per_day": 13.0,
  "solar_peak_sun_hours": 6.5,
  "net_grid_draw_kWh_per_day": 24.782,
  "monthly_grid_bill": 89.22,
  "climate_zone": "",
  "assumptions": [
    "AC assumed 1.8 kW for 1-star and decreases by 0.2 kW per extra star.",
    "Ceiling fans assumed 65 W each, running 15 hours per day.",
    "Water heaters assumed 1.2-3.0 kW base power scaled by tank size.",
    "Refrigerators assumed 0.9 kWh per 100 L for 1-star ratings.",
    "Microwave assumed at 1.2 kW for one hour daily.",
    "Dishwasher assumed 1.5 kWh per cycle.",
    "Washing machine assumed 1.3 kWh per cycle for Top Load and 1.0 kWh otherwise.",
    "TV energy estimated by screen size band and daily usage hours.",
    "Computers assumed 120 W each while running.",
    "Assume peak sun hours = 6.5 for climate zone 'Hot & Dry'.",
    "Estimated solar generation = 13.0 kWh/day from 2.0 kWp capacity."
  ]
}

const similarHouseholdsData: ComparisionSummary = {
   "comparison_columns": [
      "house_type",
      "num_bedrooms",
      "floor_area_sqft",
      "num_floors",
      "num_occupants",
      "climate_zone",
      "city_tier"
    ],
    "similar_households_found": 1,
    "top_matches": [
      {
        "house_type": "Apartment",
        "num_bedrooms": 2,
        "floor_area_sqft": 706.0,
        "num_occupants": 3,
        "climate_zone": "Hot & Dry",
        "city_tier": "Tier 3",
        "daily_energy_consumption_kWh": 34.43,
        "monthly_energy_consumption_kWh": 1032.8,
        "similarity_distance": 870.0999999999999
      },
      {
        "house_type": "Apartment",
        "num_bedrooms": 2,
        "floor_area_sqft": 906.0,
        "num_occupants": 3,
        "climate_zone": "Hot & Dry",
        "city_tier": "Tier 3",
        "daily_energy_consumption_kWh": 44.43,
        "monthly_energy_consumption_kWh": 932.8,
        "similarity_distance": 900
      }
    ],
    "peer_average_daily_kWh": 34.43,
    "peer_average_monthly_kWh": 1032.8,
    "target_daily_kWh": 24,
    "target_monthly_kWh": 800,
    "daily_percentile": 20,
    "monthly_percentile": 15,
    "notes": [
                "The comparison uses occupancy, appliance, building envelope, and renewable asset ",
                "features from the profile to rank households with similar energy use patterns.",
                "Percentile indicates how your household compares to similar households. ",
                "Higher percentile means higher energy consumption relative to peers."
            ]
}


@Component({
  selector: 'app-consumption-analysis',
  imports: [ConsumptionDashboardComponent, SolarRoiComponent, SimilarHouseholdsComponent],
  templateUrl: './consumption-analysis.html',
  styleUrl: './consumption-analysis.css',
  providers: [AppService]
})
export class ConsumptionAnalysis {
  consumptionData = consumptionData
  solarRoiData = solarRoiData
  similarHouseholdsData = similarHouseholdsData
}
