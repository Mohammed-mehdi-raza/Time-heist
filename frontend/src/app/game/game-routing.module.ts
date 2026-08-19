import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameScreenComponent } from './components/game-screen/game-screen.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {path:'',component:GameScreenComponent}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), GameScreenComponent],
  exports: [RouterModule]
})
export class GameRoutingModule { }
