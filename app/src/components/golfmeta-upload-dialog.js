import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import { firestore } from '../firebase.js';
import { store } from '../store.js';

// This element is *not* connected to the Redux store.
class GolfmetaUploadDialog extends connect(store)(LitElement) {
  static get properties() {
    return {
      videoSelected: {type: Boolean},
      lastUploadedSwingId: {type: String},
      swingListenerUnsubscribe: {type: Object}
    };
  }

  static get styles() {
    return [
      css`
        .fileInput {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }

        .hideGot {
          display:none;
        }

        .showGot {
          display:block;
        }        

        .hideWaiting {
          display:none;
        }

        .showWaiting {
          display:block;
        }`
      ];
  }

  constructor(){
    super();
    this.gotClass = 'hideGot';
    this.waitingClass = 'showWaiting';
  }

  getLocalFile(e){
    // Check the filesize

    this.gotClass = 'showGot';
    this.waitingClass = 'hideWaiting';
    //console.log(e.target.files[0]);
    this.videoFile = e.target.files[0];
    this.videoSelected = true;
    //console.log(this.shadowRoot.getElementById('videoFile'));
    this.shadowRoot.getElementById('videoFile').src = URL.createObjectURL(e.target.files[0]);
    this.shadowRoot.getElementById('videoFile').parentElement.load();
  }

  uploadToSprout(token, docId){
    var formData  = new FormData();
    formData.append('source_video', this.videoFile);
    formData.append('title', docId);
    formData.append('token', token);
    formData.append('notification_url', 'https://us-central1-golf-meta-dev.cloudfunctions.net/sproutWebHook');
    fetch('https://api.sproutvideo.com/v1/videos', {
      method: 'POST',
      body: formData
    }).then((response) => {
      //console.log('upload response: ', response);
    });
  }

  uploadFile(){
    if (this.videoFile.size > 10000000){
      alert('file too big');
      return;
    }

    if (!this.signedIn){
      alert('You must login');
      return;
    }

    var clubSelect = this.shadowRoot.getElementById('club');
    var club = clubSelect.options[clubSelect.selectedIndex].value;
    var handicapSelect = this.shadowRoot.getElementById('handicap');
    var handicap = handicapSelect.options[handicapSelect.selectedIndex].value;

    if (club == 'x'){
      alert('you must choose a club');
      return;
    }

    if (handicap == 'x'){
      alert('you must enter a handicap');
      return;
    }

    // Get sprout token from firebase functions
    fetch('https://us-central1-golf-meta-dev.cloudfunctions.net/getSproutToken')
      .then(
        (response) => {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // save data to firebase
          firestore.collection("swings").add({
              userId: this.userId,
              size: this.videoFile.size,
              type: this.videoFile.type,
              name: this.videoFile.name,
              state: 'uploading',
              club: club,
              handicap: handicap
          })
          .then((docRef) => {
            this.lastUploadedSwingId = docRef.id;
            this.swingListenerUnsubscribe = firestore.collection('swings').doc(this.lastUploadedSwingId).onSnapshot((doc) => {
              //console.log("Current data: ", doc.data());
              if (doc.data().state == 'deployed'){
                alert('Your video is ready!!!');
                this.swingListenerUnsubscribe();
                // send an event to close the upload dialog
              }
            });
            response.json().then((data) => this.uploadToSprout(data.token, docRef.id));
          })
          .catch((error) => {
              console.error("Error adding document: ", error);
          });


        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });

    // Set record in firebase
    // Upload Video to sprout
    // Save response from sprout (still have to wait for status with a web hook somewhere), I can set this in the notification url in the upload

  }

  cancelUpload(){
    this.videoSelected = false;
    this.gotClass = 'hideGot';
    this.waitingClass = 'showWaiting';
  }

  render() {
    var handicaps = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
    var clubs = ['Driver', '3w', '5w', '1i', '2i', '3i', '4i'];
    return html`
      <input class="fileInput" accept="video/*" id="videoFileInput" @change="${this.getLocalFile}" type="file" />
      <div>uploaded id: ${this.lastUploadedSwingId}</div>
      <div class="${this.gotClass}">
        <div>
          <video width="150" height="150">
            <source id="videoFile">
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div>
          <label for="handicap">Handicap</label>
          <select id="handicap">
            <option value="x"></option>
            <option value="none">I don't have a Handicap</option>
            ${handicaps.map((item) => html`<option value="${item}">${item}</option>`)}
          </select>
        </div>
        <div>
          <label for="club">Club</label>
          <select id="club">
            <option value="x"></option>
            <option value="none">I don't want to enter a club</option>
            ${clubs.map((item) => html`<option value="${item}">${item}</option>`)}
          </select>
        </div>
        <div>
          <button @click="${this.uploadFile}">Save</button>
          <button @click="${this.cancelUpload}">Cancel</button>
        </div>
      </div>
      <label for="videoFileInput" class="${this.waitingClass}">Choose a file</label>
    `;
  }

  stateChanged(state) {
    this.userId = state.user.id;
    this.signedIn = state.user.signedIn;
  }
}

window.customElements.define('golfmeta-upload-dialog', GolfmetaUploadDialog);