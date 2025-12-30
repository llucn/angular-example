import { Component, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Uploader } from '../service/uploader';

@Component({
  imports: [HttpClientModule, FormsModule],
  selector: 'upload-file',
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.scss',
})
export class UploadFile {
  http = inject(HttpClient);
  uploadProgress: number = 0;
  value:number = 0;
  isUploading: boolean = false;
  fileToUpload: File | null = null;
  private uploader = inject(Uploader); 

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.isUploading = true;
      this.http.post('/upload', formData, {
        reportProgress: true,
        observe: 'events',
      }).subscribe((event: any) => {
        console.log(event)
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
            console.log("uploadProgress",this.uploadProgress);
          }
        } else if (event.type === HttpEventType.Response) {
          console.log('Upload complete:', event.body);
          this.uploadProgress = 100;
          setTimeout(() => {
            this.isUploading = false;
          }, 1000);
        }
      },
      (error: any) => {
        console.error('Upload error:', error);
        this.isUploading = false;
      });
    }
  }
}