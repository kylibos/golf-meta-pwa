/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import {PolymerElement} from '@polymer/polymer';
import { plusIcon } from './my-icons.js';
import './golfmeta-upload-dialog.js';

import { store } from '../store.js';
import { firestore } from '../firebase.js';

import {
  updateSwings
} from '../actions/swings.js';

import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-fab/paper-fab.js';


class GolfMetaHome extends connect(store)(PageViewElement) {

  static get styles() {
    return [
      SharedStyles,
      css`
        #addVideoButton {
          display: block;
          position: fixed;
          bottom:40px;
          right: 40px;
        }`
    ];
  }

  static get properties() {
    return { 
      signedIn: { type: Boolean }
    };
  }

  constructor(){
    super();
  }

  firstUpdated(){
    console.log('first update');
    var swings = [];
    // Connect to firebase here and send the results to the action to get the videos
    firestore.collection('swings').get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            swings[doc.id]=doc.data();
        });
      // Send the data to the store
      store.dispatch(updateSwings(swings));
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  }

  render() {
    return html`
      Home Page
      <paper-fab id="addVideoButton" src="${plusIcon}" @click="${this.addVideoButtonClicked}"></paper-fab>

      <paper-dialog id="uploadVideoDialog">
        <golfmeta-upload-dialog></golfmeta-upload-dialog>
      <paper-dialog>
    `;
  }

  addVideoButtonClicked(){
    if (this.signedIn){
      this.shadowRoot.getElementById('uploadVideoDialog').open();
    } else {
      alert('you have to log in first!');
    }
  }

  stateChanged(state) {
    console.log(state);
    this.signedIn = state.user.signedIn;
    this.swings = state.swings.swings;
  }

}

window.customElements.define('golfmeta-home', GolfMetaHome);
