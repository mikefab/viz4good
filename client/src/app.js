import React, { Component } from 'react';

import App1 from './components/demo-app2/src/app';

class App extends Component {

  render() {
        let templates = [];
        templates.push(
          <div>
            <div class="mdc-layout-grid" style={{'border': 'solid red 1px'}}>
              <div class="mdc-layout-grid__inner" style={{'border': 'solid green 1px'}}>
                <div class="mdc-layout-grid__cell" style={{'border': 'solid blue 1px'}}>
                  <div class="mdc-layout-grid__inner" style={{'border': 'solid yellow 1px'}}>
                    <div class="mdc-layout-grid__cell"><span>Second level</span></div>
                    <div class="mdc-layout-grid__cell"><span>Second level</span></div>
                  </div>
                </div>
                <div class="mdc-layout-grid__cell">First level</div>
                <div class="mdc-layout-grid__cell">First level</div>
              </div>
            </div>
            <App1 />
          </div>
        );
    return (
      <div className="App" style={{'padding-left': '20px'}}>
        {templates}
      </div>
    );
  }
}

export default App;
