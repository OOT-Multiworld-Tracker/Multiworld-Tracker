import React, { Component } from "react";
import Header from "../Header";

export default class Window extends Component {
  render () {
    return (
        <div className="window" onClick={this.props.onClick}>
            <Header />

            <div className="window-content">
                <div class="pane-group">
                    {this.props.children}
                </div>
            </div>

        </div>
    )
  }
} 