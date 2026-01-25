import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.html',
    styleUrl: './app.css',
    imports: [RouterOutlet],
    providers: []
})
export class AppComponent {
    constructor(public auth: AuthService) { }
    
    logout() {
        this.auth.logout();
    }
}