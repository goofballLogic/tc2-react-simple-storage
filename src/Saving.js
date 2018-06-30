import React, { Component } from "react";

import ProviderChooser from "./ProviderChooser";

class Saving extends Component {

    handleChoose( provider ) {

        const { context, onContextChange } = this.props;
        onContextChange( { ...context, provider } );

    }

    render() {

        const { context, onCancel } = this.props;
        const { provider } = context || {};
        const { Provider } = provider || {};
        return <article className="saving">

            <header>Saving</header>
            <button onClick={onCancel}>Cancel</button>
            { Provider
                ? <div className="selected-provider">

                    <Provider {...this.props} onChange={provider => this.handleChoose( provider )} provider={provider} />

                </div>
                : <ProviderChooser {...this.props} onChoose={provider => this.handleChoose( provider ) } /> }


        </article>;

    }

}

export { Saving };
