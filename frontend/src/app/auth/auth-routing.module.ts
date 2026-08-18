import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthParentComponent } from './auth-parent/auth-parent.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: AuthParentComponent },
  { path: 'howToPlay', component: HowToPlayComponent },
  { path: 'about-us',component: AboutUsComponent},
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
