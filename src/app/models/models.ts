export interface Medication {
    id?: number;
    user_id?: number;
    name: string;
    type: 'short_acting_bronchodilator' | 'long_acting_bronchodilator' | 'inhaled_corticosteroid' | 'oral_corticosteroid' | 'combination_inhaler' | 'leukotriene_modifier' | 'biologic' | 'antihistamine' | 'nebulizer_solution' | 'other';
    dosage: string;
    frequency?: string;
    administration_route?: string;
    is_active: boolean;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface DailyTreatment {
    id?: number;
    user_id?: number;
    medication_id: number;
    medication?: Medication;
    date: string;
    dose: string;
    taken: boolean;
    taken_at?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CrisisEvent {
    id?: number;
    user_id?: number;
    started_at: string;
    ended_at?: string;
    severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
    location?: string;
    peak_flow_before?: number;
    peak_flow_after?: number;
    duration_minutes?: number;
    triggers?: string[];
    notes?: string;
    medications?: CrisisMedication[];
    created_at?: string;
    updated_at?: string;
    cough_level?: number;
    shortness_of_breath?: number;
    wheezing?: number;
}

export interface CrisisMedication {
    id?: number;
    crisis_event_id: number;
    medication_id: number;
    medication?: Medication;
    dose: string;
    administration_route?: string;
    notes?: string;
}

export interface ErVisit {
    id?: number;
    user_id?: number;
    visited_at: string;
    hospital: string;
    duration_hours?: number;
    outcome?: string;
    peak_flow_on_arrival?: number;
    peak_flow_on_discharge?: number;
    oxygen_saturation?: number;
    notes?: string;
    medications?: ErVisitMedication[];
    created_at?: string;
    updated_at?: string;
}

export interface ErVisitMedication {
    id?: number;
    er_visit_id: number;
    medication_id: number;
    medication?: Medication;
    dose: string;
    administration_route?: string;
    notes?: string;
}

export interface Hospitalization {
    id?: number;
    user_id?: number;
    admission_date: string;
    discharge_date?: string;
    hospital: string;
    diagnosis?: string;
    ward?: string;
    peak_flow_on_admission?: number;
    peak_flow_on_discharge?: number;
    notes?: string;
    treatments?: HospitalizationTreatment[];
    created_at?: string;
    updated_at?: string;
}

export interface HospitalizationTreatment {
    id?: number;
    hospitalization_id: number;
    medication_id: number;
    medication?: Medication;
    dose: string;
    frequency?: string;
    notes?: string;
}

export interface SymptomLog {
    id?: number;
    user_id?: number;
    date: string;
    cough_level: number;
    shortness_of_breath: number;
    wheezing: number;
    night_awakenings: number;
    peak_flow?: number;
    act_score?: number;
    used_rescue_inhaler: boolean;
    rescue_inhaler_puffs: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    date_of_birth?: string;
    phone?: string;
    allergens?: string[];
    doctor_name?: string;
    doctor_phone?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    best_peak_flow?: number;
    asthma_severity?: 'intermittent' | 'mild_persistent' | 'moderate_persistent' | 'severe_persistent';
}

export interface DashboardStats {
    days_since_last_crisis: number | null;
    crisis_this_month: number;
    er_visits_this_year: number;
    hospitalizations_this_year: number;
    today_treatments: {
        taken: number;
        total: number;
    };
    week_adherence: number;
    peak_flow_history: {
        date: string;
        peak_flow: number | null;
        act_score: number | null;
    }[];
    last_symptom_log: SymptomLog | null;
    active_medications: number;
}
