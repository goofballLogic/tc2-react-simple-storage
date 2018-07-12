import React, { Component } from "react";
import { format, parse } from "date-fns";
import { initializing, listFolders, authorize, createFolder } from "./google-drive-logic";

const Folder = ( { id, name, onClick } ) => <li><button onClick={() => onClick()}>{name}</button></li>;

function modifyDate( value, pattern = "dddd, MMMM Qo, YYYY [at] h:mma" ) {

    try {

        const parsed = parse( value );
        if( isNaN( parsed ) ) return null;
        return format( parsed, pattern );

    } catch( ex ) {

        return null;

    }

}

class Provider extends Component {

    constructor() {

        super();
        this.state = { folderBrowsers: [], folderName: "" };
        initializing
            .then( () => this.setState( { initialized: true } ) )
            .then( () => this.listFolders() )
            .catch( err => this.setState( { err } ) );

    }

    async listFolders() {

        const { onChoose } = this.props;
        const user = await authorize();
        onChoose( { user } );
        const folderBrowser = await listFolders();
        this.setState( { folderBrowsers: [ folderBrowser ] } );

    }

    handleFolderSelect( folderBrowser ) {

        const { onChoose } = this.props;
        onChoose( { folderBrowser } );

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

    renderControls() {

        const { folderBrowsers } = this.state;
        const selectedBrowser = this.state.selectedBrowser || folderBrowsers[ folderBrowsers.length - 1 ];
        return <div className="controls">

            <button onClick={() => this.handleFolderSelect( selectedBrowser )} disabled={!(selectedBrowser && selectedBrowser.current.id)}>Select</button>
            <button onClick={() => listFolders()}>Refresh folders</button>

        </div>;

    }

    renderFolderList() {

        const { folderBrowsers } = this.state;
        const selectedBrowser = this.state.selectedBrowser || folderBrowsers[ folderBrowsers.length - 1 ];
        return <div className="folder-browsers" key="folder-browsers">

            {folderBrowsers.map( folderBrowser => <div key={folderBrowser.current.id} className={folderBrowser === selectedBrowser ? "selected" : ""}>

                <button className="folder-list-folder" onClick={() => this.select( folderBrowser )}>{folderBrowser.current.name || "Home"}</button>
                <ul className="folder-list">

                    {( folderBrowser.list || [] ).map( item => <Folder key={item.id} {...item } onClick={() => this.go( folderBrowser, item )} /> )}

                </ul>

            </div> )}

        </div>;

    }

    async createFolder() {

        const { selectedBrowser, folderName } = this.state;
        if ( !folderName ) { return; }
        const { context } = this.props;
        this.setState( { creatingFolder: true } );
        try {

            const folderId = await createFolder( selectedBrowser, folderName );
            const folderBrowser = await listFolders( folderId );
            this.setState( { folderName: "", creatingFolder: undefined } );

        } catch( err ) {

            this.setState( { creatingFolder: undefined, err } );

        }

    }

    renderSelectedDetail() {

        const { folderBrowsers, folderName } = this.state;
        const selectedBrowser = this.state.selectedBrowser || folderBrowsers[ folderBrowsers.length - 1 ];
        if ( !selectedBrowser ) return null;
        let path = selectedBrowser.path().slice( 0, -1 ).join( "/" );
        path = path ? `/${path}` : "";
        const { name, modified, id } = selectedBrowser.current;
        const formatted = modifyDate( modified );
        return id
            ? <div className="selected-folder" key="selected-folder">

                <div>{path}</div>
                <h2>{name}</h2>
                {formatted && <p className="last-modified">{formatted}</p>}
                <form onSubmit={e => e.preventDefault()} className="create-folder">

                    <h3>New folder</h3>
                    {path}/{name}/<input type="text" onChange={e => this.setState( { folderName: e.target.value } )} value={folderName} placeholder="Folder name" />
                    <button onClick={() => this.createFolder()}>Create</button>

                </form>

            </div>
            : <div className="selected-folder" key="selected-folder">

                <h2>No folder selected</h2>

            </div>;

    }

    renderPicker() {

        const { folderBrowsers } = this.state;
        return folderBrowsers.length > 0
            ? [ this.renderControls(), this.renderSelectedDetail(), this.renderFolderList() ]
            : <div className="folder-list-loading" key="folder-list-loading">loading...</div>;

    }

    render() {

        const { initialized, err } = this.state;
        if ( err ) { throw err; }
        return initialized
            ? this.renderPicker()
            : <div key="initializing">Initializing...</div>;

    }

}

export default Provider;
