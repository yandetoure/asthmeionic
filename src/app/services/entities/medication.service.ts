import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api';
import { Medication } from '../../models/models';

@Injectable({
    providedIn: 'root'
})
export class MedicationService {
    constructor(private api: ApiService) { }

    getAll(active?: boolean): Observable<Medication[]> {
        return this.api.get<Medication[]>('medications', { active });
    }

    getById(id: number): Observable<Medication> {
        return this.api.get<Medication>(`medications/${id}`);
    }

    create(medication: Medication): Observable<Medication> {
        return this.api.post<Medication>('medications', medication);
    }

    update(id: number, medication: Partial<Medication>): Observable<Medication> {
        return this.api.put<Medication>(`medications/${id}`, medication);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`medications/${id}`);
    }
}
