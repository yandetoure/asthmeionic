import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth';
import { User } from '../models/models';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab5',
    templateUrl: 'tab5.page.html',
    styleUrls: ['tab5.page.scss'],
    standalone: false
})
export class Tab5Page implements OnInit {
    user: User | null = null;

    constructor(private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.user = this.auth.getCurrentUser();
    }

    logout() {
        this.auth.logout().subscribe(() => {
            this.router.navigateByUrl('/auth/login', { replaceUrl: true });
        });
    }
}
