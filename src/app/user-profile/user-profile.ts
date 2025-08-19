import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'user-profile',
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  name = signal('Code');
  length = computed(() => this.name().length);
  favorate = signal(['Angular', 'React', 'Vue']);

  changeName(event: Event) {
    console.log('Button clicked:', event);
    this.name.set('XCode');
  }

  nameChanged(event: Event) {
    console.log('Name changed:', event);
    this.name.set(event.toString());
  }
}