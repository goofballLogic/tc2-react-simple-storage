import React, { Component } from "react";

import ProviderChooser from "./ProviderChooser";

class Saving extends Component {

    constructor() {

        super();
        this.state = {};

    }

    render() {

        const { Provider } = this.state;
        if ( Provider ) {

            return <Provider {...this.props} />;

        } else {

            return <ProviderChooser {...this.props} />;

        }

    }

}

export { Saving };
