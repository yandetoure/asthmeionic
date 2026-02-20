import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api';
import { SymptomLog } from '../../models/models';

@Injectable({
    providedIn: 'root'
})
export class SymptomLogService {
    constructor(private api: ApiService) { }

    getAll(params: any = {}): Observable<any> {
        return this.api.get<any>('symptom-logs', params);
    }

    create(log: Partial<SymptomLog>): Observable<SymptomLog> {
        return this.api.post<SymptomLog>('symptom-logs', log);
    }

    update(id: number, log: Partial<SymptomLog>): Observable<SymptomLog> {
        return this.api.put<SymptomLog>(`symptom-logs/${id}`, log);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`symptom-logs/${id}`);
    }
}
