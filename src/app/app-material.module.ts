import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material';

@NgModule({
   imports: [
      MatIconModule,
      MatToolbarModule,
      MatFormFieldModule,
      MatSelectModule
   ],
   exports: [
      MatIconModule
   ]
})

export class AppMaterialModule { }