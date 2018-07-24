import React, { Component } from "react";
import { render } from "react-dom";

import "./live-example.scss";

import SampleDataForm from "./SampleDataForm";
import ErrorBoundary from "./ErrorBoundary";
import { StorageStatus, Saving, FileListing } from "./";

const APP_ID = "live-example-1531673864527";

const indexTemplate = ( now ) => ( {

    owner: APP_ID,
    version: "0.1",
    created: now.toISOString()

} );

async function save( data, { provider, selectedFolder } ) {

    const filename = `${(new Date()).toISOString().slice( 0, 10 )}.json`;
    await provider.uploadAsJSON( selectedFolder, filename, data );
    alert( "Saved" );

}
class LiveExample extends Component {

    constructor() {

        super();
        this.state = {};

    }

    async handleSave( data ) {

        const { saveContext } = this.state;
        if ( saveContext && saveContext.connected ) {

            await save( data, saveContext );

        } else {

            this.savingDialog.showModal();
            setTimeout( () => this.savingDialog.querySelector( "button" ).focus(), 100 );
            this.setState( { saveNeeded: data } );

        }

    }

    async handleContextChange( saveContext ) {

        const { saveNeeded } = this.state;
        const { provider, connected, selectedFolder } = saveContext;
        this.setState( { saveContext } );

        if ( selectedFolder ) {

            if ( !connected ) {

                const content = await provider.downloadParsedJSON( selectedFolder, "_index.json" );
                if( content && content.owner !== APP_ID ) {

                    alert( `Sorry, that folder is being used by something else (${content.owner ? content.owner : "Unknown"})` );
                    this.setState( { selectedFolder: undefined } );
                    return;

                }
                const now = new Date();
                const newContent = content || indexTemplate( now );
                newContent.lastAccessed = now.toISOString();
                await provider.uploadAsJSON( selectedFolder, "_index.json", newContent );
                this.setState( { saveContext: { ...saveContext, connected: true } } );
                this.savingDialog.close();

            }
            if ( saveNeeded ) {

                await save( saveNeeded, saveContext );

            }

        }

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
                <FileListing context={saveContext} />

            </ErrorBoundary>

        </article>;

    }

}



export const renderLiveExample = selector =>

    render(

        <LiveExample />,
        document.querySelector( selector )

    );

