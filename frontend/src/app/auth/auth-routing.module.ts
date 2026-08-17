import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthParentComponent } from './auth-parent/auth-parent.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';

const routes: Routes = [
  { path: '', component: AuthParentComponent },
  { path: 'howToPlay', component: HowToPlayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
