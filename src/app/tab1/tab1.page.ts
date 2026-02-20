import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth';
import { EventService } from '../services/entities/event.service';
import { DashboardStats, User } from '../models/models';
import Chart from 'chart.js/auto';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, AfterViewInit {
  @ViewChild('peakFlowChart') peakFlowChartCanvas!: ElementRef;

  user: User | null = null;
  stats: DashboardStats | null = null;
  today = new Date();
  chart: any;

  constructor(
    private auth: AuthService,
    private eventService: EventService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
    this.loadStats();
  }

  ngAfterViewInit() {
    // Initialized when data is ready
  }

  loadStats() {
    this.eventService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        setTimeout(() => this.initChart(), 0);
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  initChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.stats || !this.stats.peak_flow_history) return;

    const data = this.stats.peak_flow_history;
    const labels = data.map(d => new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' }));
    const values = data.map(d => d.peak_flow);

    const ctx = this.peakFlowChartCanvas.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Débit de pointe (L/min)',
          data: values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(255, 255, 255, 0.4)', font: { size: 10 } }
          }
        }
      }
    });
  }

  async addSymptomLog() {
    const toast = await this.toastCtrl.create({
      message: 'Fonctionnalité journal bientôt disponible',
      duration: 2000,
      color: 'medium'
    });
    toast.present();
  }

  async emergency() {
    if (!this.user?.emergency_contact_phone) {
      const toast = await this.toastCtrl.create({
        message: 'Aucun contact d\'urgence configuré dans votre profil',
        duration: 3000,
        color: 'warning'
      });
      toast.present();
      return;
    }
    window.open(`tel:${this.user.emergency_contact_phone}`, '_system');
  }
}
