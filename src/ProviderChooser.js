import React, { Component } from "react";
import { queryProviders } from "./providers/messages";

const ProviderChoice = ( { id, name, Icon } ) => console.log( Icon ) || <li>

    <div className="icon"><Icon /></div>
    <div className="name">{name}</div>

</li>;

class ProviderChooser extends Component {

    constructor() {

        super();
        this.state = {};
        queryProviders().then(

            providers => this.setState( { providers } ),
            ex => this.setState( { error: ex } )

        );

    }

    renderLoadingProviders() {

        return <div className="providers-loading">

            Waiting for storage providers to respond.

        </div>;

    }

    renderChooseProvider() {

        const { providers } = this.state;
        return <ul className="providers">

            {providers.map( provider => <ProviderChoice key={provider.id} {...provider} /> )}

        </ul>;

    }

    render() {

        if ( this.state.error ) { throw this.state.error; }
        return <div className="provider-chooser">

            {this.state.providers
                ? this.renderChooseProvider()
                : this.renderLoadingProviders()}

        </div>;

    }
}

export default ProviderChooser;