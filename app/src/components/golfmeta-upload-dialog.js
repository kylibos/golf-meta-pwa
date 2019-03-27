import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

import { firestore } from '../firebase.js';
import { store } from '../store.js';

// This element is *not* connected to the Redux store.
class GolfmetaUploadDialog extends connect(store)(LitElement) {
  static get properties() {
    return {
      videoSelected: {type: Boolean},

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

  tester(e){
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
    //formData.append('folder_id', 'golfMeta');
    console.log('doc id:', docId);
    formData.append('title', docId);
    formData.append('token', token);
    formData.append('notification_url', 'https://us-central1-golf-meta-dev.cloudfunctions.net/sproutWebHook');
    fetch('https://api.sproutvideo.com/v1/videos', {
      method: 'POST',
      body: formData
    }).then((response) => {
      console.log('upload response: ', response);
    });
  }

  uploadFile(){
    console.log(this.shadowRoot.getElementById('videoFile'));

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
              status: 'uploading'
          })
          .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
              //Upload to sprout
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
    return html`
      <input class="fileInput" accept="video/*" id="videoFileInput" @change="${this.tester}" type="file" />
      
      <div class="${this.gotClass}">
        <div>
          <video width="150" height="150">
            <source id="videoFile">
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div>
          <input id="handicapInput" type="text" />
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
  }
}

window.customElements.define('golfmeta-upload-dialog', GolfmetaUploadDialog);