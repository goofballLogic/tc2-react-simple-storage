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
        this.setState( {

            folderBrowsers,
            selectedBrowser: folderBrowsers[ folderBrowsers.length - 1 ]

        } );

    }

    select( selectedBrowser ) {

        this.setState( { selectedBrowser } );

    }

    renderFolderList() {

        const { folderBrowsers } = this.state;
        const selectedBrowser = this.state.selectedBrowser || folderBrowsers[ folderBrowsers.length - 1 ];
        return <div className="folder-browsers" key="selected-folder">

            {folderBrowsers.map( folderBrowser => <div key={folderBrowser.current.id} className={folderBrowser === selectedBrowser ? "selected" : ""}>

                <button className="folder-list-folder" onClick={() => this.select( folderBrowser )}>{folderBrowser.current.name || "Home"}</button>
                <ul className="folder-list">

                    {( folderBrowser.list || [] ).map( item => <Folder key={item.id} {...item } onClick={() => this.go( folderBrowser, item )} /> )}

                </ul>

            </div> )}

        </div>;

    }

    renderSelectedDetail() {

        const { folderBrowsers } = this.state;
        const selectedBrowser = this.state.selectedBrowser || folderBrowsers[ folderBrowsers.length - 1 ];
        if ( !selectedBrowser ) return null;
        let path = selectedBrowser.path().slice( 0, -1 ).join( " / " );
        path = path ? `/${path}` : "";
        return <div className="selected-folder" key="selected-folder">

            <p>Select a folder:</p>
            <div>{path}</div>
            <h2>{selectedBrowser.current.name || "Home"}</h2>
            <button>Select</button>

        </div>;

    }

    renderPicker() {

        const { folderBrowsers } = this.state;
        return folderBrowsers.length > 0
            ? [

                this.renderSelectedDetail(),
                this.renderFolderList()

            ]
            : <div key="folder-list-loading">loading...</div>;

    }

    render() {

        const { initialized, err } = this.state;
        if ( err ) { throw err; }
        return initialized ? this.renderPicker() : <div key="initializing">Initializing...</div>;

    }

}

export default Provider;
