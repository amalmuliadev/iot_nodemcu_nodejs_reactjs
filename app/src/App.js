import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

const url = 'http://localhost:5000';
// const url = 'http://10.60.165.39:5000';
const uri = process.env.NODE_ENV === 'production' ? "/api/" : `${url}/api/`;

const style = {
  margin: 12,
  width: 180,
};

const paperStyle = {
  height: 240,
  width: 450,
  margin: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = socketIOClient(url);

    this.state = {
      lux: '0',
      volt: '0',  
      led1on: 0,
      led2on: 0,
    }
  }

  componentDidMount() {
    this.socket.on('status', data => this.setState({ ...data }));
    this.socket.on('ldr', data => this.setState({ ...data }));
  }

  send() {
    this.socket.emit('setStatus', { led1on: this.state.led1on, led2on: this.state.led2on });
    this.socket.emit('setLdr', { lux: this.state.lux, volt: this.state.volt });
  }

  render() {
    return (
      <div>
        <AppBar
          title="NodeMCU App"
          showMenuIconButton={false}
        />

        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

          <Paper zDepth={2} style={paperStyle}>
              <div>
                <span style={{fontSize: 60}}>{this.state.lux} LUX</span>
              </div>
              <div>
                <span style={{fontSize: 60}}>{this.state.volt} v</span>
              </div>
          </Paper>

          <div>
            <RaisedButton
              label={`Led 1 ${this.state.led1on ? 'AKTIF' : 'OFF'}`}
              primary={true}
              style={style}
              onClick={() => {
                this.setState(
                  { led1on: this.state.led1on === 1 ? 0 : 1 },
                  () => this.send()
                );
              }}
            />

            <RaisedButton
              label={`Led 2 ${this.state.led2on ? 'AKTIF' : 'OFF'}`}
              primary={true}
              style={style}
              onClick={() => {
                this.setState(
                  { led2on: this.state.led2on === 1 ? 0 : 1 },
                  () => this.send()
                );
              }}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
