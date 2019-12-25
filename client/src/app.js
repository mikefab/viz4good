import React, { Component } from 'react';

import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog';
import App1 from './components/demo-app2/src/app';

class App extends Component {
  state = {
    isOpen: false,
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
      let refreshed_at = !!refresh ? "Last refreshed at: " +
      new Date(Date.parse(keplerJson.info.created_at)).toUTCString() : null
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

  _handleDialog = () => {
    this.setState({
      isOpen: this.state.isOpen ? false : true
    })
  }
  render() {
        let isOpen = this.state.isOpen
        let keplerJson = this.state.keplerJson
        let created_at = new Date(this.state.created_at).toLocaleDateString('en-US')
        let refreshed_at = this.state.refreshed_at
        let introHeight = this.state.introHeight
        let templates = [];
        templates.push(
          <div >
            <div className="mdc-layout-grid"id='intro' >
                This is an animated visualization of Ebola confirmed cases in the North Kivu Ebola Outbreak in the Democratic Republic of the Congo (DRC).
                <button className="mdc-button" onClick={this._handleDialog}>
                  <div className="mdc-button__ripple"></div>
                  <span className="mdc-button__label">Click here for more on this app</span>
                </button>
              <Dialog open={isOpen}>
                <DialogTitle>Ebola confirmed cases visualization</DialogTitle>
                <DialogContent className='mdc-dialog--scrollable'>
		  <br/>
                  <div>
                    The data displayed in this map was last fetched from <a target='_blank' href='https://data.humdata.org/dataset/ebola-cases-and-deaths-drc-north-kivu'>The Humanitarian Data Exchange</a> on <strong>{created_at}</strong>. They update it every few days.
                    Click
                    <button className="mdc-button" onClick={this._refreshData}>
                      <div className="mdc-button__ripple"></div>
                      <span className="mdc-button__label"> here </span>
                    </button>
                    to fetch latest data.
                    <div style={{height: '15px'}}>
                      <strong>
                        {refreshed_at}
                      </strong>
                    </div>
                    <br/>
                    The code for this app can be found <a target='_blank' href='https://github.com/mikefab/viz4good'>here</a>. The borderfile is <a target='_blank' href='https://data.humdata.org/dataset/ebola-cases-and-deaths-drc-north-kivu'>here</a>.
                    <br/>
                    <h3>Pro tips</h3>
                    <ul>
                      <li>
                        The map might not show up on some android devices.
                      </li>
                      <li>
                        You'll have to zoom out a bit to see all areas with cases.
                      </li>
		      <li>
		        Also, please see the image below...
		      </li>
                    </ul>
                    <img src='/images/Ebola_Confirmed_Cases__DRC_.jpg' width='400'/>
                  </div>
                </DialogContent>
                <DialogFooter>
                  <DialogButton onClick={this._handleDialog}>Close</DialogButton>
                </DialogFooter>
              </Dialog>
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
