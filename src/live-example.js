import React, { Component } from "react";
import { render } from "react-dom";

import "./live-example.scss";

import SampleDataForm from "./SampleDataForm";
import ErrorBoundary from "./ErrorBoundary";
import { StorageStatus, Saving } from "./";

const indexTemplate = {

    "version": "live-example"

};
class LiveExample extends Component {

    constructor() {

        super();
        this.state = {};

    }

    handleSave( saveNeeded ) {

        this.savingDialog.showModal();
        setTimeout( () => this.savingDialog.querySelector( "button" ).focus(), 100 );
        this.setState( { saveNeeded } );

    }

    async handleContextChange( saveContext ) {

        const { saveNeeded } = this.state;
        const { provider, connected, folderBrowser } = saveContext;
        if ( connected ) {

            this.savingDialog.close();
            this.setState( { saveNeeded: undefined } );

        } else if ( folderBrowser ) {

            const content = await provider.downloadParsedJSON( folderBrowser, "_index.json" );
            const newContent = content || JSON.parse( JSON.stringify( indexTemplate ) );
            newContent.lastAccessed = (new Date()).toISOString();
            newContent.created = newContent.created || newContent.lastAccessed;
            await provider.uploadAsJSON( folderBrowser, "_index.json", newContent );

        }
        this.setState( { saveContext } );

    }

    handleCancelSaving() {

        this.savingDialog.close();
        this.setState( { saveNeeded: undefined } );
        setTimeout( () => alert( "Save cancelled" ), 0 );

    }

    render() {

        const { saveNeeded, saveContext } = this.state;
        return <article className="live-example">

            <ErrorBoundary>

                <StorageStatus context={saveContext} />
                <dialog ref={x => this.savingDialog = x}>
                    {saveNeeded && <Saving
                        data={saveNeeded}
                        context={saveContext}
                        onContextChange={context => this.handleContextChange( context )}
                        onCancel={() => this.handleCancelSaving()} />}
                </dialog>
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

