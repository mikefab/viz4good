import React, { Component } from 'react';

import App1 from './components/demo-app2/src/app';

class App extends Component {
  state = {
    keplerJson: null,
    created_at: null,
    fetched_at: null,
    introHeight: 0
  };

  _handleKeplerJson(keplerJson, thing, refresh) {
    return new Promise((resolve, reject) => {
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
      let refreshed_at = !!refresh ? "Last refreshed at: " + keplerJson.info.created_at : null
      thing.state.keplerJson = keplerJson
      console.log('about to render!')
      thing.setState({
        keplerJSON: keplerJson,
        created_at: keplerJson.info.created_at,
        refreshed_at: refreshed_at
      })
    })


  }

  componentDidMount() {
      console.log(document.getElementById('intro').clientHeight, 'lllll')
    this.setState({
      introHeight: parseInt(document.getElementById('intro').clientHeight)
    })
    // fetch('/public/keplergl.json')
    fetch('/api/url')
    .then(response => response.json())
    .then(keplerJson => {
      this._handleKeplerJson(keplerJson, this)
    })
  }

  _refreshData = () => {
    fetch('/api/refresh')
    .then(response => response.json())
    .then(keplerJson => {
      this._handleKeplerJson(keplerJson, this, 'refresh')
    })
  }
  render() {

        let keplerJson = this.state.keplerJson
        let created_at = new Date(this.state.created_at).toLocaleDateString('en-US')
        let refreshed_at = this.state.refreshed_at
        let introHeight = this.state.introHeight
        let templates = [];
        templates.push(
          <div>
            <div className="mdc-layout-grid" id='intro'>
                This is an animated visualization of Ebola confirmed cases in the North Kivu Ebola Outbreak in the Democratic Republic of the Congo (DRC).

                The data comes from <a href='https://data.humdata.org/'>The Humanitarian Data Exchange</a>. Here is the app <a href='https://github.com/mikefab/viz4good'>code base</a>, and the <a href='https://data.humdata.org/dataset/ebola-cases-and-deaths-drc-north-kivu'>shapefiles</a>.
                The data was last fetched on {created_at}.
                <button className="mdc-button" onClick={this._refreshData}>
                  <div className="mdc-button__ripple"></div>
                  <span className="mdc-button__label">Click here to fetch again.</span>
                </button>
                &nbsp; {refreshed_at}

            </div>
            <App1 keplerJson={keplerJson}  introHeight={introHeight}/>
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
