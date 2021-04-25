import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InboxRoutingModule } from './inbox-routing.module';
import { InboxComponent } from './inbox.component';
import { MessagesComponent } from './messages/messages.component';
import { MatModule } from '../../../module/mat/mat.module';


@NgModule({
  declarations: [InboxComponent, MessagesComponent],
  imports: [
    CommonModule,
    InboxRoutingModule,
    MatModule
  ]
})
export class InboxModule { }
