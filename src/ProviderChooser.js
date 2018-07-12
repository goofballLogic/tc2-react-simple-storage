import React, { Component } from "react";
import { queryProviders } from "./providers/messages";

const noop = () => {};

const ProviderChoice = ( { id, name, Icon, onChoose, Provider } ) => <li>

    <button onClick={onChoose}>

        <div className="icon"><Icon /></div>
        <div className="name">{name}</div>

    </button>

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
        const { onChoose = noop } = this.props;
        return <ul className="providers">

            {providers.map( provider => <ProviderChoice key={provider.id} {...provider} onChoose={() => onChoose( { provider } )} /> )}

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