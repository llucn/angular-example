import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserProfile } from './user-profile/user-profile';
import { Receipt } from './receipt';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserProfile, Receipt],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-example');
}
