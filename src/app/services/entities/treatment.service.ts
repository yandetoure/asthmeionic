import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api';
import { DailyTreatment } from '../../models/models';

@Injectable({
    providedIn: 'root'
})
export class TreatmentService {
    constructor(private api: ApiService) { }

    getByDate(date: string): Observable<any> {
        return this.api.get<any>('daily-treatments', { date });
    }

    create(treatment: DailyTreatment): Observable<DailyTreatment> {
        return this.api.post<DailyTreatment>('daily-treatments', treatment);
    }

    markTaken(id: number): Observable<DailyTreatment> {
        return this.api.post<DailyTreatment>(`daily-treatments/${id}/mark-taken`, {});
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`daily-treatments/${id}`);
    }
}
