 export type FieldType = 'select' | 'number' | 'checkbox';

export type FormField =
  | {
      type: 'select';
      label: string;
      controlName: string;
      options: string[];
    }
  | {
      type: 'number' | 'checkbox';
      label: string;
      controlName: string;
    };

export interface Section {
  label: string;
  fields: FormField[];
}

export interface FormDetails {
  [key: number]: Section;
}

export interface Constants {
  VALID_HOUSE_TYPES: string[];
  VALID_CLIMATE_ZONES: string[];
  VALID_CITY_TIERS: string[];
  VALID_WATER_HEATER_TYPES: string[];
  VALID_WASHING_MACHINE_TYPES: string[];
  VALID_INSULATION_TYPES: string[];
  VALID_WINDOW_TYPES: string[];
  VALID_ROOF_TYPES: string[];
  formDetails: FormDetails;
}
 
 const constants: Constants = {
    VALID_HOUSE_TYPES: ["Apartment", "Villa", "Bungalow", "Townhouse", "Penthouse"],
    VALID_CLIMATE_ZONES: ["Hot & Dry", "Hot & Humid", "Composite", "Temperate", "Cold"],
    VALID_CITY_TIERS: ["Tier 1", "Tier 2", "Tier 3"],
    VALID_WATER_HEATER_TYPES: ["Solar + Backup", "Electric Geyser", "Heat Pump", "None"],
    VALID_WASHING_MACHINE_TYPES: ["Top Load", "Semi-Automatic"],
    VALID_INSULATION_TYPES: ["Excellent", "Good", "Average", "Poor"],
    VALID_WINDOW_TYPES: ["Single Pane", "Double Pane", "Triple Pane"],
    VALID_ROOF_TYPES: ["Sloped Tiled", "Flat RCC", "Insulated RCC"],
    formDetails: {
        0: {
            label: "House Profile", fields: [{ label: "House Type", controlName: "house_type", type: "select", options: ["Apartment", "Villa", "Bungalow", "Townhouse", "Penthouse"] },
            { label: "Number of Bedrooms", controlName: "num_bedrooms", type: "number" },
            { label: "Climate Zone", controlName: "climate_zone", type: "select", options: ["Hot & Dry", "Hot & Humid", "Composite", "Temperate", "Cold"] },
            { label: "City Tier", controlName: "city_tier", type: "select", options: ["Tier 1", "Tier 2", "Tier 3"] },
            { label: "Electricity Tariff (per kWh)", controlName: "electricity_tariff_per_kWh", type: "number" }
            ]
        },
        1: {
            label: "Occupancy Details", fields: [
                { label: "Number of Adults", controlName: "num_adults", type: "number" },
                { label: "Number of Children", controlName: "num_children", type: "number" },
            ]
        },
        2: {
            label: "Appliances", fields: [{ label: "Has AC?", controlName: "has_ac", type: "checkbox" },
            { label: "Number of AC Units", controlName: "num_ac_units", type: "number" },
            { label: "AC Star Rating", controlName: "ac_star_rating", type: "number" },
            { label: "AC Usage (hrs/day)", controlName: "ac_usage_hrs_per_day", type: "number" },
            { label: "Number of Ceiling Fans", controlName: "num_ceiling_fans", type: "number" },
            { label: "Water Heater Type", controlName: "water_heater_type", type: "select", options: ["Solar + Backup", "Electric Geyser", "Heat Pump", "None"] },
            { label: "Water Heater Capacity (L)", controlName: "water_heater_capacity_L", type: "number" },
            { label: "Water Heater Usage (hrs/day)", controlName: "water_heater_usage_hrs_per_day", type: "number" },
            { label: "Has Refrigerator?", controlName: "has_refrigerator", type: "checkbox" },
            { label: "Fridge Capacity (L)", controlName: "fridge_capacity_L", type: "number" },
            { label: "Fridge Star Rating", controlName: "fridge_star_rating", type: "number" },
            { label: "Has Washing Machine?", controlName: "has_washing_machine", type: "checkbox" },
            { label: "Washing Machine Type", controlName: "washing_machine_type", type: "select", options: ["Top Load", "Semi-Automatic"] },
            { label: "Washing Cycles per Week", controlName: "washing_cycles_per_week", type: "number" },
            { label: "Number of Computers", controlName: "num_computers", type: "number" },
            { label: "Computer Usage (hrs/day)", controlName: "computer_usage_hrs_per_day", type: "number" },
            { label: "Number of TVs", controlName: "num_tvs", type: "number" },
            { label: "TV Screen Size (inch)", controlName: "tv_screen_size_inch", type: "number" },
            { label: "TV Usage (hrs/day)", controlName: "tv_usage_hrs_per_day", type: "number" },
            { label: "Has Dishwasher?", controlName: "has_dishwasher", type: "checkbox" },
            { label: "Dishwasher Cycles per Week", controlName: "dishwasher_cycles_per_week", type: "number" },
            { label: "Has Microwave?", controlName: "has_microwave", type: "checkbox" },]
        },
        3: { label: "Building Envelope", fields: [{ label: "Insulation Quality", controlName: "insulation_quality", type: "select", options: ["Poor", "Average", "Good"] }, { label: "Window Type", controlName: "window_type", type: "select", options: ["Single Pane", "Double Pane", "Triple Pane"] }, { label: "Roof Type", controlName: "roof_type", type: "select", options: ["Sloped Tiled", "Flat RCC", "Insulated RCC"] }] },
        4: {
            label: "Renewable Energy Assets", fields: [{ label: "Has Solar Panels?", controlName: "has_solar_panels", type: "checkbox" },
            { label: "Solar Capacity (kWp)", controlName: "solar_capacity_kWp", type: "number" },
            { label: "Has Battery Storage?", controlName: "has_battery_storage", type: "checkbox" },
            { label: "Battery Capacity (kWh)", controlName: "battery_capacity_kWh", type: "number" }]
        },
    }
}

export default constants;