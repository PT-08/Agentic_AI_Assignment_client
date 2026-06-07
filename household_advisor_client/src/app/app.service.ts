import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class AppService {
    profileData: Record<string, any> = {}

    getProfileData = () => this.profileData;
    setProfileData = (data:Record<string, any>) => this.profileData = data;
}