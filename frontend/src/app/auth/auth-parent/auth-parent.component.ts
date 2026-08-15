import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth-parent',
  standalone: true,
  imports: [LoginComponent,HomeComponent,RegisterComponent],
  templateUrl: './auth-parent.component.html',
  styleUrl: './auth-parent.component.scss'
})
export class AuthParentComponent {

}
