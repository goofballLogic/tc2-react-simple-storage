import React, { Component } from "react";
import { render } from "react-dom";

import "./live-example.scss";

import SampleDataForm from "./SampleDataForm";
import ErrorBoundary from "./ErrorBoundary";
import { StorageStatus, Saving } from "./";

class LiveExample extends Component {

    constructor() {

        super();
        this.state = {

            saveNeeded: null,
            saveContext: null

        };

    }

    handleSave( saveNeeded ) {

        this.setState( { saveNeeded } );

    }

    handleContextChange( saveContext ) {

        this.setState( { saveContext } );

    }
    render() {

        const { saveNeeded, saveContext } = this.state;
        return <article className="live-example">

            <ErrorBoundary>

                <StorageStatus saveContext={saveContext} />
                {saveNeeded && <Saving data={saveNeeded} context={saveContext} onContextChange={context => this.handleContextChange( context )} />}
                <SampleDataForm onSave={data => this.handleSave( data )} />

            </ErrorBoundary>

        </article>;

    }

}



export const renderLiveExample = selector =>

    render(

        <LiveExample />,
        document.querySelector( selector )

    );

