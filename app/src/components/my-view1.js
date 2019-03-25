/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyView1 extends PageViewElement {

  static get styles() {
    return [
      SharedStyles
    ];
  }


  render() {
    return html`
      <section id="farty">
        <h2>Static page</h2>
        <p>This is a text-only page.</p>
        <p>It doesn't do anything other than display some static text.</p>
      </section>
          <!--<div style="position:relative;height:0;padding-bottom:56.25%">
      <iframe id="iframe" class="sproutvideo-player" src="https://videos.sproutvideo.com/embed/709adcb31f19e5c6f8/cd8cf2e796aa69d3" style="position:absolute;width:100%;height:100%;left:0;top:0" frameborder="0"></iframe>
    </div>-->
      <div style="border:1px solid blue;">
        <iframe id="frame"src="http://127.0.0.1:8081/view2" style="width:100%;height:300px;"></iframe>
      </div>
    <button @click="${this.handleClick}">test</button>

    <button @click="${() => this.decrement()}" aria-label="decrement">-</button>
          <p>${this.value}</p>
          <button @click="${() => this.increment()}" aria-label="increment">+</button>
        
    `;
  }

        static get properties() {
        return {
          value: {type: Number}
        }
      }

      constructor() {
        super();
        this.value = 0;
      }

      decrement() {
        this.value--;
        this._valueChanged();
      }

      increment() {
        this.value++;
        //this._valueChanged();
      }

  firstUpdated(){

      //console.log(this.shadowRoot.getElementById('farty'));
      //var iframe = this.shadowRoot.getElementById('iframe');
      //console.log(iframe.contentDocument);
      //console.log(document);
      //console.log(this.shadowRoot.getElementById('video-709adcb31f19e5c6f8-html'));

      //var player = new SV.Player({videoId: '709adcb31f19e5c6f8'});
       //console.log(player);
  }

  handleClick(){
    console.log(this.shadowRoot.getElementById('frame').contentDocument);
    //console.log(this.shadowRoot.querySelector("v"));
      //console.log(iframe.getElementById('video-709adcb31f19e5c6f8-html'));
  }
}

window.customElements.define('my-view1', MyView1);
