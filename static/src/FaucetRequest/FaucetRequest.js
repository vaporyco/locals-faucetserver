import React, { Component } from "react";
import "./FaucetRequest.css";
import Vap from "vapjs";
import config from "react-global-configuration";
import axios from "axios";
import timespan from "timespan";

class FaucetRequest extends Component {
  constructor(props) {
    super(props);
    this.state = { targetAccount: "", requestrunning: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearMessages = this.clearMessages.bind(this);
  }

  handleChange(event) {
    this.setState({ targetAccount: event.target.value });
  }

  clearMessages(event) {
    this.setState({ faucetresponse: null, fauceterror: null });
  }

  handleSubmit(event) {
    this.clearMessages();
    if (Vap.isAddress(this.state.targetAccount)) {
      this.setState({ requestrunning: true });

      let apiUrl = config.get("apiurl") + "/donate/" + this.state.targetAccount;
      axios
        .get(apiUrl)
        .then(response => {
          this.setState({ requestrunning: false });
          if (response.status === 200) {
            this.setState({
              faucetresponse: {
                address: response.data.address,
                amount: response.data.amount,
                txhash: response.data.txhash,
                vaporscanlink:
                  config.get("vaporscanroot") + "/tx/" + response.data.txhash
              }
            });
            return;
          }
        })
        // Catch any error here
        .catch(error => {
          this.setState({ requestrunning: false });
          if (!error || !error.response) {
            this.setState({
              fauceterror: {
                message: 'Error connecting to the API: ' + error.message,
              }
            });
            return;
          }
          if (error.response.status === 403) {
            let t = new timespan.TimeSpan(error.response.data.duration, 0, 0);
            this.setState({
              fauceterror: {
                message: error.response.data.message,
                duration: error.response.data.duration,
                timespan: t
              }
            });
            return;
          }
        });
    } else {
      this.setState({ fauceterror: { message: "invalid address" } });
    }
    event.preventDefault();
  }

  componentDidMount() {
    window.addEventListener("load", () => {
      // See if there is a pubkey on the URL
      let urlTail = window.location.search.substring(1);
      if (Vap.isAddress(urlTail)){
        this.setState({ targetAccount: urlTail });
        return;
      }

      // If web3 is not injected (modern browsers)...
      if (typeof window.web3 === "undefined") {
        // Listen for provider injection
        window.addEventListener("message", ({ data }) => {
          if (data && data.type && data.type === "VAPORY_PROVIDER_SUCCESS") {
            this.vap = new Vap(window.vapory);
          }
        });
        // Request provider
        window.postMessage({ type: "VAPORY_PROVIDER_REQUEST" }, "*");
      }
      // If web3 is injected (legacy browsers)...
      else {
        this.vap = new Vap(window.web3.currentProvider);
        this.vap
          .accounts()
          .then(accounts => {
            if (accounts && accounts[0]) {
              this.setState({ targetAccount: accounts[0] });
            }
          })
          .catch(() => {});
      }
    });
  }

  render() {
    return (
      <div className="">
        <section className="section">
          <div className="container bottompadding">
            <form onSubmit={this.handleSubmit}>
              <div className="field">
                <label className="label">
                  Enter your vapory account address
                </label>
                <div className="control">
                  <input
                    className="input is-primary"
                    type="text"
                    placeholder="Enter your vapory account address"
                    value={this.state.targetAccount}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button
                    disabled={this.state.requestrunning}
                    className="button is-link"
                  >
                    Send me Vapor
                  </button>
                </div>
              </div>
            </form>
          </div>
          {this.state.requestrunning}

          <div className="container">
            {this.state.faucetresponse ? (
              <article
                className="message is-success"
                onClick={this.clearMessages}
              >
                <div className="message-body">
                  <p>VAP sent to {this.state.faucetresponse.address}.</p>
                  <p>
                    Transaction hash{" "}
                    <a
                      target="_new"
                      href={this.state.faucetresponse.vaporscanlink}
                    >
                      {this.state.faucetresponse.txhash}
                    </a>
                  </p>
                </div>
              </article>
            ) : (
              <p />
            )}
            {this.state.fauceterror ? (
              <article
                className="message is-danger"
                onClick={this.clearMessages}
              >
                <div className="message-body">
                <b>{this.state.fauceterror.message}</b><br/>
                  {this.state.fauceterror.timespan ? (
                    <span>
                      You are greylisted for another{" "}
                      {this.state.fauceterror.timespan.hours} hours and{" "}
                      {this.state.fauceterror.timespan.minutes} minutes.
                    </span>
                  ) : (
                    <span />
                  )}
                </div>
              </article>
            ) : (
              <p />
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default FaucetRequest;
