import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs'
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-home.component',
    imports: [RouterLink, DatePipe],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy{
    private timerSub?: Subscription

    month!: Date
    nextReset!: Date
    remainingMs: number = 0;

    constructor(public auth: AuthService) { }

    ngOnInit(): void {
        this.nextReset = this.getNextMonthlyReset()
        this.updateRemaining()

        this.timerSub = interval(1000).subscribe(() => this.updateRemaining())
    }

    ngOnDestroy(): void {
        this.timerSub?.unsubscribe()
    }

    public getNextMonthlyReset(): Date {
        const now = new Date()
        const year = now.getUTCFullYear()
        const month = now.getUTCMonth()
        const day = now.getUTCDate()

        let reset = new Date(year, month, 15)

        if (day > 15 || (day === 15 && now >= reset))
            reset = new Date(year, month + 1, 15)
        
        this.month = new Date(year, reset.getUTCMonth() + 1, 1)
        return reset;
    }

    private updateRemaining(): void {
        const now = Date.now()
        const diff = this.nextReset.getTime() - now

        if (diff <= 0) {
            this.nextReset = this.getNextMonthlyReset()
            this.remainingMs = this.nextReset.getTime() - now;
        } else {
            this.remainingMs = diff
        }
    }

    get remaining(): {
        days: number
        hours: number
        minutes: number
        seconds: number
    } {
        const totalSeconds = Math.floor(this.remainingMs / 1000)

        return {
            days: Math.floor(totalSeconds / 86400),
            hours: Math.floor((totalSeconds % 86400) / 3600),
            minutes: Math.floor((totalSeconds % 3600) / 60),
            seconds: totalSeconds % 60
        }
    }
}
