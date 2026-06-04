import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import * as constants from './constants';

@Component({
  selector: 'app-profile-data',
  imports: [CommonModule, ReactiveFormsModule, MessageModule, StepperModule, InputNumberModule, InputTextModule, SelectModule, CheckboxModule, ButtonModule, FloatLabelModule, CardModule],
  templateUrl: './profile-data.html',
  styleUrl: './profile-data.css',
})
export class ProfileData {
  activeStep: number = 0;
  profileForm: FormGroup;
  constants = constants.default;
  Number = Number; // to use in template for converting string keys to numbers

  constructor(private fb: FormBuilder) {
    console.log(this.constants.formDetails);
    this.profileForm = this.fb.group({

      house_type: ['', Validators.required],
      num_bedrooms: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      climate_zone: ['', Validators.required],
      city_tier: ['', Validators.required],

      num_adults: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
      num_children: ['', [Validators.required, Validators.min(1), Validators.max(20)]],

      has_ac: [''],
      num_ac_units: ['', [Validators.min(0), Validators.max(10)]],
      ac_star_rating: ['', [Validators.min(1), Validators.max(5)]],
      ac_usage_hrs_per_day: ['', [Validators.min(0), Validators.max(24)]],

      num_ceiling_fans: ['', [Validators.min(0), Validators.max(10)]],

      water_heater_type: [''],
      water_heater_capacity_L: ['', [Validators.min(0)]],
      water_heater_usage_hrs_per_day: ['', [Validators.min(0), Validators.max(24)]],

      has_refrigerator: [''],
      fridge_capacity_L: ['', [Validators.min(50), Validators.max(1000)]],
      fridge_star_rating: ['', [Validators.min(1), Validators.max(5)]],

      has_washing_machine: [''],
      washing_machine_type: [''],
      washing_cycles_per_week: ['', [Validators.min(0), Validators.max(50)]],

      num_computers: ['', [Validators.min(0), Validators.max(10)]],
      computer_usage_hrs_per_day: ['', [Validators.min(0), Validators.max(24)]],

      num_tvs: ['', [Validators.min(0), Validators.max(10)]],
      tv_screen_size_inch: ['', [Validators.min(20), Validators.max(100)]],
      tv_usage_hrs_per_day: ['', [Validators.min(0), Validators.max(24)]],

      has_dishwasher: [''],
      dishwasher_cycles_per_week: ['', [Validators.min(0), Validators.max(50)]],

      has_microwave: [''],

      insulation_quality: ['', Validators.required],
      window_type: ['', Validators.required],
      roof_type: ['', Validators.required],

      has_solar_panels: [''],
      solar_capacity_kWp: ['', [Validators.min(0), Validators.max(50)]],

      has_battery_storage: [''],
      battery_capacity_kWh: ['', [Validators.min(0), Validators.max(100)]],

      electricity_tariff_per_kWh: ['', [Validators.required, Validators.min(0)]]
    });

    this.addConstraints();
  }

  addConstraints() {
    // AC constriaints
    this.profileForm.get('has_ac')?.valueChanges.subscribe(val => {
      const acControls = ['num_ac_units', 'ac_star_rating', 'ac_usage_hrs_per_day'];

      acControls.forEach(ctrl => {
        if (val === 1) {
          this.profileForm.get(ctrl)?.enable();
        } else {
          this.profileForm.get(ctrl)?.disable();
        }
      });
    });

    //water heater constraints
    this.profileForm.get('water_heater_type')?.valueChanges.subscribe(val => {
      const waterHeaterControls = ['water_heater_capacity_L', 'water_heater_usage_hrs_per_day'];

      if (val) {
        waterHeaterControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        waterHeaterControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // refrigerator constraints
    this.profileForm.get('has_refrigerator')?.valueChanges.subscribe(val => {
      const fridgeControls = ['fridge_capacity_L', 'fridge_star_rating'];

      if (val === 1) {
        fridgeControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        fridgeControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // washing machine constraints
    this.profileForm.get('has_washing_machine')?.valueChanges.subscribe(val => {
      const washingMachineControls = ['washing_machine_type', 'washing_cycles_per_week'];

      if (val === 1) {
        washingMachineControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        washingMachineControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // dishwasher constraints
    this.profileForm.get('has_dishwasher')?.valueChanges.subscribe(val => {
      const dishwasherControls = ['dishwasher_cycles_per_week'];

      if (val === 1) {
        dishwasherControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        dishwasherControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // solar panel constraints
    this.profileForm.get('has_solar_panels')?.valueChanges.subscribe(val => {
      const solarControls = ['solar_capacity_kWp'];

      if (val === 1) {
        solarControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        solarControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // battery storage constraints
    this.profileForm.get('has_battery_storage')?.valueChanges.subscribe(val => {
      const batteryControls = ['battery_capacity_kWh'];

      if (val === 1) {
        batteryControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        batteryControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

  }

  nextStep() {
    this.activeStep++;
  }

  prevStep() {
    this.activeStep--;
  }


  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

}
