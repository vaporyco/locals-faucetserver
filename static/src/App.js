// Import React and Component
import React, { Component } from "react";
import "bulma/css/bulma.css";
import "./App.css";
import FaucetInfo from "./FaucetInfo/FaucetInfo";
import FaucetRequest from "./FaucetRequest/FaucetRequest";
import config from "react-global-configuration";
import configuration from "./config";

config.set(configuration);

class App extends Component {
  render() {
    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Vapory Faucet</h1>
            </div>
          </div>
        </section>
        
          <div className="container">
            <FaucetRequest />
            <FaucetInfo />
          </div>
       
      </div>
    );
  }
}

export default App;
