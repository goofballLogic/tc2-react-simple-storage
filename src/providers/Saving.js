import React, { Component } from "react";

import ProviderChooser from "./ProviderChooser";

class Saving extends Component {

    handleChoose( chosenContext ) {

        const { context, onContextChange } = this.props;
        const newContext = { ...context, ...chosenContext };
        onContextChange( newContext );

    }

    clearProvider() {

        this.handleChoose( { provider: undefined, user: undefined } );

    }

    render() {

        const { context, onCancel, onError } = this.props;
        const { provider } = context || {};
        const { Provider } = provider || {};
        const onChoose = context => this.handleChoose( context );
        return <article className="saving">

            <header>

                <h2>Saving</h2>
                <button className="cancel" onClick={onCancel}>Cancel</button>
                {Provider && <div className="provider-name">

                    <span>{provider.name}</span>
                    <button onClick={() => this.clearProvider()}>Deselect</button>

                </div>}

            </header>
            { Provider
                ? <div className={`selected-provider ${provider.className}`}>

                    <Provider {...this.props} provider={provider}
                        onChoose={onChoose}
                        onCancelProvider={() => this.clearProvider()}
                        onError={err => onError( err )}  />

                </div>
                : <ProviderChooser {...this.props} provider={provider} onChoose={onChoose} /> }


        </article>;

    }

}

export { Saving };
