import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { ChatNavBarComponent } from './chat-nav-bar/chat-nav-bar.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ChatThreadComponent } from './chat-thread/chat-thread.component';
import { ChatThreadsComponent } from './chat-threads/chat-threads.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MessagesService } from './message/messages.service';
import { ThreadsService } from './thread/threads.service';
import { UsersService } from './user/users.service';
import { fromNowPipeInjectables } from './pipes/from-now.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ChatNavBarComponent,
    ChatMessageComponent,
    ChatPageComponent,
    ChatThreadComponent,
    ChatThreadsComponent,
    ChatWindowComponent,
    fromNowPipeInjectables
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ThreadsService , MessagesService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
