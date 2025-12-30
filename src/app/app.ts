import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserProfile } from './user-profile/user-profile';
import { Receipt } from './receipt';
import { UploadFile } from './upload-file/upload-file';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserProfile, Receipt, UploadFile],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-example');
}
