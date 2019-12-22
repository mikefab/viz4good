import React, { Component } from 'react';

import App1 from './components/demo-app2/src/app';

class App extends Component {
  state = {
    keplerJson: null,
    thing: 'zzzz'

  };

  componentDidMount() {
    // fetch('/public/keplergl.json')
    fetch('/api/url')
    .then(response => response.json())
    .then(keplerJson => {
      console.log('Data arrived')
      let lookup = {}
      keplerJson.datasets[0].data.allData.forEach(e => {

        if (e[0].length > 100) {
          let feature = JSON.parse(e[0])
          lookup[feature.properties.cle] = e[0]
        } else {
          e[0] = lookup[e[0]]
        }
      })
      this.state.keplerJson = keplerJson
      this.state.thing = 'xxxxXXXx'
      console.log('about to render!')
      this.setState({
        keplerJSON: keplerJson
      })
    })
  }

  render() {
        console.log(!!this.state.keplerJson, '&&&&')
        console.log(this.state, '!!!!')
        let keplerJson = this.state.keplerJson
        let thing = this.state.thing
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
            <App1 keplerJson = {keplerJson} thing={thing}/>
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
