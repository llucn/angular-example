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
  fileModelList: FileModel[] = [];

  onFileSelected(event: any): void {
    const files: File[] = event.target.files;
    this.fileModelList = [];
    Array.from(files).forEach(file => {
      const fileModel: FileModel = {
        file,
        uploadUrl: '/upload',
        subscription: null,
        isSucess: false,
        isError: false,
        errorMessage: null,
        progressCount: 0,
        isUploading: false,
      };
      this.fileModelList.push(fileModel);
      this.uploadFile(fileModel);
    });
  }

  uploadFile(fileModel: FileModel) {
    const formData = new FormData();
    formData.append(fileModel.file.name, fileModel.file);

    fileModel.isUploading = true;
    const upload$ = this.http.post(fileModel.uploadUrl, formData, {
        reportProgress: true,
        observe: 'events',
      }).pipe(
        tap((event: any) => {
          console.log('tap', fileModel.file.name, event);
        }),
        catchError((error) => {
          console.log(fileModel.file.name, error);
          fileModel.isError = true;
          fileModel.errorMessage = error.message || 'Upload failed';
          return throwError(() => error);
        }),
        finalize(() => {
          setTimeout(() => {
            fileModel.isUploading = false;
          }, 200);
        }),
      );

      fileModel.subscription = upload$.subscribe((event: any) => {
        console.log('subscription', fileModel.file.name, event);
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            fileModel.progressCount = Math.round((100 * event.loaded) / event.total);
            console.log("uploadProgress", fileModel.file.name, fileModel.progressCount);
          }
        } else if (event.type === HttpEventType.Response) {
          console.log('Upload complete:', fileModel.file.name, event.body);
          fileModel.progressCount = 100;
          fileModel.isSucess = true;
        }
      });
  }

  cancelUpload(fileModel: FileModel) {
    fileModel.subscription?.unsubscribe();
    fileModel.subscription = null;
  }

  reset() {
    this.fileModelList = [];
  }
}

export interface FileModel {
  file: File;
  uploadUrl: string;
  subscription: Subscription | null;
  isSucess: boolean;
  isError: boolean;
  errorMessage: string | null;
  progressCount: number;
  isUploading: boolean;
}