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

import { store } from '../store.js';
import { firestore } from '../firebase.js';


class GolfMetaSwingVideo extends connect(store)(PageViewElement) {


  static get properties() {
    return { 
    };
  }

  constructor(){
    super();

    // get video id

    var param_array = window.location.href.split('?')[1].split('sw=');
    console.log(param_array[1]);
  }

  render() {
    return html`
      <div>Swing Video
      </div>
    `;
  }


  stateChanged(state) {
  }

}

window.customElements.define('golfmeta-swingvideo', GolfMetaSwingVideo);
