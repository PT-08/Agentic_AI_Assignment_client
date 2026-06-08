import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecommendationsData } from "./recommendations/recommendations";

@Injectable({ providedIn: 'root' })
export class AppService {
    constructor(private http: HttpClient) {}
    profileData: Record<string, any> = {}

    getProfileData = () => this.profileData;
    setProfileData = (data: Record<string, any>) => this.profileData = data;

    getRecommendationsData = (): RecommendationsData => this.recommendationsData;
    setRecommendationsData = (data: RecommendationsData) => this.recommendationsData = data;

    private recommendationsData: RecommendationsData = {
        "recommendations": [
            {
                "title": "HVAC Smart Thermal Integration & Optimization",
                "description": "Deploy automated cloud-synchronized smart thermostat hardware mapping dynamically against regional Time-of-Use (ToU) utility pricing matrices.",
                "estimated_monthly_kwh_savings": 142.5,
                "estimated_monthly_cost_savings": 1280.0,
                "implementation_cost": 4500.0,
                "priority": "High",
                "confidence_score": 0.94
            },
            {
                "title": "Baseline Vampire Load Suppression Gateways",
                "description": "Isolate persistent structural stand-by draws using smart automation power strips across media servers and home entertainment subsystems.",
                "estimated_monthly_kwh_savings": 38.0,
                "estimated_monthly_cost_savings": 340.0,
                "implementation_cost": 1200.0,
                "priority": "Medium",
                "confidence_score": 0.88
            },
            {
                "title": "Optimized Shift of Heavy-Appliance Operational Cycles",
                "description": "Configure smart intervals via internal schedulers to automate clothes washing and water-heating arrays strictly outside of peak system constraints.",
                "estimated_monthly_kwh_savings": 65.2,
                "estimated_monthly_cost_savings": 580.0,
                "implementation_cost": 0.0,
                "priority": "Low",
                "confidence_score": 0.79
            }
        ]
    };

    getRecommendations = (profileData: Record<string, any>, cb: (data: RecommendationsData) => void): void => {
        this.http.post<RecommendationsData>('http://localhost:5000/recommendations', profileData).subscribe(
            (response) => {
                this.setRecommendationsData(response);
                cb(response);
            },
            (error) => {
                console.error('Error fetching recommendations:', error);
            }
        );
    }
}