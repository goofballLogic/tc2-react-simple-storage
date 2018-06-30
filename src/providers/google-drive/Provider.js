import React, { Component } from "react";
import { initializing, listFolders, authorize } from "./google-drive-logic";

const Folder = ( { id, name, parents } ) => <li>{name} {JSON.stringify(parents)}</li>;

class Provider extends Component {

    constructor() {

        super();
        this.state = {};
        initializing
            .then( gapi => this.setState( { initialized: true, gapi } ) )
            .then( () => this.listFolders() )
            .catch( err => this.setState( { err } ) );

    }

    listFolders() {

        const { onChange, provider } = this.props;
        const { gapi } = this.state;
        authorize( gapi.client ).then( user => {

            if ( !provider.user || provider.user.id !== user.id )
                onChange( { ...provider, user } );
            return listFolders( gapi.client );

        } ).then( folderBrowser => this.setState( { folderBrowser } ) );

    }

    renderFolderList() {

        const { folderBrowser } = this.state;
        return folderBrowser
            ? <ul className="folder-list">

                {folderBrowser.list.map( item => <Folder key={item.id} {...item } /> )}

            </ul>
            : <div>loading...</div>;

    }

    render() {

        const { onChange } = this.props;
        const { initialized, err } = this.state;
        if ( err ) { throw err; }
        return <div>

            {initialized
                ? this.renderFolderList()
                : <div>Initializing...</div>}
            <button onClick={() => onChange( null )}>Deselect</button>

        </div>;

    }

}

export default Provider;
