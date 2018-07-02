import React, { Component } from "react";
import { initializing, listFolders, authorize } from "./google-drive-logic";

const Folder = ( { id, name, onClick } ) => <li><button onClick={() => onClick()}>{name}</button></li>;

class Provider extends Component {

    constructor() {

        super();
        this.state = { folderBrowsers: [] };
        initializing
            .then( gapi => this.setState( { initialized: true, gapi } ) )
            .then( () => this.listFolders() )
            .catch( err => this.setState( { err } ) );

    }

    listFolders() {

        const { onChoose, provider } = this.props;
        const { gapi } = this.state;
        authorize( gapi.client ).then( user => {

            if ( !provider.user || provider.user.id !== user.id )
                onChoose( { ...provider, user } );
            return listFolders( gapi.client );

        } ).then( folderBrowser => this.setState( { folderBrowsers: [ folderBrowser ] } ) );

    }

    go( from, to ) {

        let folder = from.go( to );
        const folderBrowsers = [ folder ];
        while( folder.back ) {

            folder = folder.back();
            folderBrowsers.unshift( folder );

        }
        this.setState( { folderBrowsers } );

    }

    renderFolderList() {

        const { folderBrowsers } = this.state;
        return folderBrowsers.length > 0
            ? folderBrowsers.map( folderBrowser => console.log( folderBrowser ) || <section key={folderBrowser.current.id}>

                <h3>{folderBrowser.current.name || "Home"}</h3>
                <ul className="folder-list">

                    {( folderBrowser.list || [] ).map( item => <Folder key={item.id} {...item } onClick={() => this.go( folderBrowser, item )} /> )}

                </ul>

            </section> )
            : <div key="folder-list-loading">loading...</div>;

    }

    render() {

        const { initialized, err } = this.state;
        if ( err ) { throw err; }
        return initialized ? this.renderFolderList() : <div key="initializing">Initializing...</div>;

    }

}

export default Provider;
