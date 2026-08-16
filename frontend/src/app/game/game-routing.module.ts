import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameScreenComponent } from './components/game-screen/game-screen.component';

const routes: Routes = [
  {path:'',component:GameScreenComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
