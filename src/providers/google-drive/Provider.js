import React, { Component } from "react";
import { initializing } from "./google-drive-logic";

class Provider extends Component {

    constructor() {

        super();
        this.state = {};
        initializing.then( () => this.setState( { initialized: true } ) );

    }

    render() {

        const { deselect } = this.props;
        const { initialized } = this.state;
        return <div>

            {initialized
                ? <div>Initialized</div>
                : <div>Initializing...</div>}
            {deselect && <button onClick={deselect}>Deselect</button>}

        </div>;

    }

}

export default Provider;
