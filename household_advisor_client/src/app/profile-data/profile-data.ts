import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { AppService } from '../app.service';

@Component({
  selector: 'app-profile-data',
  imports: [CommonModule, ReactiveFormsModule, MessageModule, StepperModule, InputNumberModule, InputTextModule, SelectModule, CheckboxModule, ButtonModule, FloatLabelModule, CardModule],
  templateUrl: './profile-data.html',
  styleUrl: './profile-data.css',
  providers: [AppService]
})
export class ProfileData {
  activeStep: number = 0;
  profileForm: FormGroup;
  constants = constants.default;
  Number = Number; // to use in template for converting string keys to numbers

  @Output() onSubmit = new EventEmitter();

  constructor(private fb: FormBuilder, private appService: AppService) {
    console.log(this.constants.formDetails);
    this.profileForm = this.fb.group({

      house_type: ['Apartment', Validators.required],
      num_bedrooms: ['4', [Validators.required, Validators.min(1), Validators.max(10)]],
      climate_zone: ['Hot & Dry', Validators.required],
      city_tier: ["Tier 1", Validators.required],

      num_adults: [3, [Validators.required, Validators.min(1), Validators.max(20)]],
      num_children: [1, [Validators.required, Validators.min(1), Validators.max(20)]],

      has_ac: [true],
      num_ac_units: [4, [Validators.min(0), Validators.max(10)]],
      ac_star_rating: [4, [Validators.min(1), Validators.max(5)]],
      ac_usage_hrs_per_day: [24, [Validators.min(0), Validators.max(24)]],

      num_ceiling_fans: [4, [Validators.min(0), Validators.max(10)]],

      water_heater_type: [true],
      water_heater_capacity_L: [50, [Validators.min(0)]],
      water_heater_usage_hrs_per_day: [18, [Validators.min(0), Validators.max(24)]],

      has_refrigerator: [true],
      fridge_capacity_L: [550, [Validators.min(50), Validators.max(1000)]],
      fridge_star_rating: [1, [Validators.min(1), Validators.max(5)]],

      has_washing_machine: [true],
      washing_machine_type: ["Top Load"],
      washing_cycles_per_week: [20, [Validators.min(0), Validators.max(50)]],

      num_computers: [5, [Validators.min(0), Validators.max(10)]],
      computer_usage_hrs_per_day: [15, [Validators.min(0), Validators.max(24)]],

      num_tvs: [2, [Validators.min(0), Validators.max(10)]],
      tv_screen_size_inch: [55, [Validators.min(20), Validators.max(100)]],
      tv_usage_hrs_per_day: [10, [Validators.min(0), Validators.max(24)]],

      has_dishwasher: [true],
      dishwasher_cycles_per_week: [20, [Validators.min(0), Validators.max(50)]],

      has_microwave: [true],

      insulation_quality: ["Good", Validators.required],
      window_type: ['Double Pane', Validators.required],
      roof_type: ["Flat RCC", Validators.required],

      has_solar_panels: [''],
      solar_capacity_kWp: [0.5, [Validators.min(0), Validators.max(50)]],

      has_battery_storage: [''],
      battery_capacity_kWh: ['', [Validators.min(0), Validators.max(100)]],

      electricity_tariff_per_kWh: [7, [Validators.required, Validators.min(0)]]
    });

    this.addConstraints();
  }

  addConstraints() {
    const constrainedFields = ['num_ac_units', 'ac_star_rating', 'ac_usage_hrs_per_day', 'water_heater_capacity_L', 'water_heater_usage_hrs_per_day', 'fridge_capacity_L', 'fridge_star_rating', 'washing_machine_type', 'washing_cycles_per_week', 'dishwasher_cycles_per_week', 'solar_capacity_kWp', 'battery_capacity_kWh'];

    // disable all constrained fields initially
    constrainedFields.forEach(field => this.profileForm.get(field)?.disable());
    // AC constriaints
    this.profileForm.get('has_ac')?.valueChanges.subscribe(val => {
      const acControls = ['num_ac_units', 'ac_star_rating', 'ac_usage_hrs_per_day'];

      acControls.forEach(ctrl => {
        if (val === true) {
          this.profileForm.get(ctrl)?.enable();
        } else {
          this.profileForm.get(ctrl)?.disable();
        }
      });
    });

    //water heater constraints
    this.profileForm.get('water_heater_type')?.valueChanges.subscribe(val => {
      const waterHeaterControls = ['water_heater_capacity_L', 'water_heater_usage_hrs_per_day'];

      if (val && val !== 'None') {
        waterHeaterControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        waterHeaterControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // refrigerator constraints
    this.profileForm.get('has_refrigerator')?.valueChanges.subscribe(val => {
      const fridgeControls = ['fridge_capacity_L', 'fridge_star_rating'];

      if (val === true) {
        fridgeControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        fridgeControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // washing machine constraints
    this.profileForm.get('has_washing_machine')?.valueChanges.subscribe(val => {
      const washingMachineControls = ['washing_machine_type', 'washing_cycles_per_week'];

      if (val === true) {
        washingMachineControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        washingMachineControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // dishwasher constraints
    this.profileForm.get('has_dishwasher')?.valueChanges.subscribe(val => {
      const dishwasherControls = ['dishwasher_cycles_per_week'];

      if (val === true) {
        dishwasherControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        dishwasherControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // solar panel constraints
    this.profileForm.get('has_solar_panels')?.valueChanges.subscribe(val => {
      const solarControls = ['solar_capacity_kWp'];

      if (val === true) {
        solarControls.forEach(ctrl => this.profileForm.get(ctrl)?.enable());
      } else {
        solarControls.forEach(ctrl => this.profileForm.get(ctrl)?.disable());
      }
    });

    // battery storage constraints
    this.profileForm.get('has_battery_storage')?.valueChanges.subscribe(val => {
      const batteryControls = ['battery_capacity_kWh'];

      if (val === true) {
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


  onFormSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      this.appService.setProfileData(this.profileForm.value);
      setTimeout(() => this.onSubmit.emit(this.profileForm.value), 100);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

}
