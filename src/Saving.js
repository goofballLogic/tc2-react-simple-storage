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
        const onChoose = provider => this.handleChoose( provider );
        return <article className="saving">

            <header>

                <h2>Saving</h2>
                <button onClick={onCancel}>Cancel</button>
                <button onClick={() => this.handleChoose( null )}>Deselect</button>

            </header>
            { Provider
                ? <div className="selected-provider">

                    <Provider {...this.props} provider={provider} onChoose={onChoose} />

                </div>
                : <ProviderChooser {...this.props} provider={provider} onChoose={ onChoose } /> }


        </article>;

    }

}

export { Saving };
