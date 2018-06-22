import React, { Component } from "react";

async function queryProviders() {


}

const ProviderChoice = ( { id, name } ) => <li key={id}>

    {name}

</li>;

class ProviderChooser extends Component {

    constructor() {

        super();
        this.state = {};
        queryProviders().then( providers => this.setState( { providers } ) );

    }

    renderLoadingProviders() {

        return <div className="providers-loading">

            Waiting for storage providers to respond.

        </div>;

    }

    renderChooserProvider() {

        const { providers } = this.state;
        return <ul className="providers">

            {providers.map( provider => <ProviderChoice {...provider} /> )}

        </ul>;

    }
    render() {

        return <div className="provider-chooser">

            {this.state.providers
                ? this.renderChooseProvider()
                : this.renderLoadingProviders()}

        </div>;

    }
}

export default ProviderChooser;