import React, { Component } from "react";

class StorageStatus extends Component {

    constructor() {

        super();
        this.state = {

            connected: true

        };

    }

    connectedStatus() {

        return <span className={`connection ${this.state.connected ? "" : "dis"}connected` }>

            {this.state.connected ? "Connected" : "Not connected"}

        </span>;

    }

    render() {

        return <div className="storage-status">

            Save status
            {this.connectedStatus()}

        </div>;

    }
}

export { StorageStatus };
