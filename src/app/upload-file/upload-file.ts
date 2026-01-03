import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { catchError, finalize, Subscription, tap, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [HttpClientModule, FormsModule, CommonModule],
  selector: 'upload-file',
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.scss',
})
export class UploadFile {
  @Input()
  requiredFileType: string = '';
  http = inject(HttpClient);
  fileName = 'N/A';
  subscription: Subscription | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append(file.name, file);

      this.isUploading = true;
      const upload$ = this.http.post('/upload', formData, {
        reportProgress: true,
        observe: 'events',
      }).pipe(
        tap((event: any) => {
          console.log('tap', event);
        }),
        catchError((error) => {
          console.log(error);
          return throwError(() => error);
        }),
        finalize(() => {
          setTimeout(() => {
            this.isUploading = false;
          }, 200);
        }),
      );

      this.subscription = upload$.subscribe((event: any) => {
        console.log('subscription', event);
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
            console.log("uploadProgress", this.uploadProgress);
          }
        } else if (event.type === HttpEventType.Response) {
          console.log('Upload complete:', event.body);
          this.uploadProgress = 100;
        }
      });
    }
  }

  cancelUpload() {
    this.subscription?.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    this.subscription = null;
  }
}