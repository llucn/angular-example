import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class Uploader {
  upload(file: File | null): boolean {
    return true;
  }
}