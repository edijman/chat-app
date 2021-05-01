import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { Conversation } from 'src/app/shared/models/conversation.model';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  // Get userProfile State
  @Select() userProfile$;
  uid: string = '';
  userDetails;
  conversationSub;
  userProfileSub;
  conversations : Conversation [];
  filteredconversations : Conversation [];
  conversationWithContDetails = [];
  loading = true;
  constructor(private conversationService: ConversationService, private auth: AuthService) { 
  }
  ngOnInit(): void {
    this.userProfile$.subscribe(res => this.userDetails = res);
    this.getUserId();
    this.getConversation();
  }

  ngOnDestroy(){
    // Subscribe from conversation when component is destryoed
    // this.conversationSub.unsubscribe();
    // this.userProfileSub.unsubscribe();
    // console.log('unsubscribed from conversation');
  }

  // get user id from state
  getUserId(){
    this.userProfile$.subscribe(res => {
        this.uid = res.userProfile.uid;
    });
  }
  // get all users conversation user is a memeber of
  getConversation(){
    this.conversationSub = this.conversationService.getConversation(this.uid).pipe(first()).subscribe(res =>{
      if(res.length > 0){
        this.conversations = res;
        this.filterOutCurrentUser();
        this.loading = false;
      }
      else{
        console.log('No conversation found!');
      }
    },
    error => {
      console.log('Unable to retrieved Conversation');
    })
  }


  //remove current user id from contact members
  filterOutCurrentUser(){
     this.filteredconversations = this.conversations.map((conversation => {
      return {...conversation, member: conversation.member.filter((uid => uid !== this.uid))}
     }));
     this.getConversationMemberDetails();
  }

  //For each members in the filtered conversation, get their profile details
  getConversationMemberDetails(){
    this.conversationWithContDetails =this.filteredconversations.map((conversation) => {
      return {...conversation, member : conversation.member.map(
        (uid) => this.getUserDetails(uid)
      )}
    });
    console.log(this.conversationWithContDetails)
  }

  getUserDetails(uid){
    let contactDetails = { username: '', profileImageUrl: '', uid: '' };
    this.userProfileSub = this.auth.getUserProfile(uid).pipe(first()).subscribe(
      (res) => {
        if(res.length > 0){
          contactDetails.username = res[0].username;
          contactDetails.profileImageUrl = res[0].profileImageUrl;
          contactDetails.uid = res[0].uid;
        }
      })
      return contactDetails;
  }
  
  updateConservation(){
    this.loading = true;
    this.getConversation();
  }
}


