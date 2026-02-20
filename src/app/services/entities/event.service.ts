import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api';
import { CrisisEvent, ErVisit, Hospitalization, DashboardStats } from '../../models/models';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    constructor(private api: ApiService) { }

    getDashboardStats(): Observable<DashboardStats> {
        return this.api.get<DashboardStats>('dashboard/stats');
    }

    // Crises
    getCrises(params: any = {}): Observable<any> {
        return this.api.get<any>('crisis-events', params);
    }

    createCrisis(data: CrisisEvent): Observable<CrisisEvent> {
        return this.api.post<CrisisEvent>('crisis-events', data);
    }

    // ER Visits
    getErVisits(params: any = {}): Observable<any> {
        return this.api.get<any>('er-visits', params);
    }

    createErVisit(data: ErVisit): Observable<ErVisit> {
        return this.api.post<ErVisit>('er-visits', data);
    }

    // Hospitalizations
    getHospitalizations(params: any = {}): Observable<any> {
        return this.api.get<any>('hospitalizations', params);
    }

    createHospitalization(data: Hospitalization): Observable<Hospitalization> {
        return this.api.post<Hospitalization>('hospitalizations', data);
    }
}
