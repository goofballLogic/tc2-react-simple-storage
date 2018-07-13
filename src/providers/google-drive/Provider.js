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

    async listFolders( folderPath ) {

        this.setState( { isLoading: true } );
        const { onChoose } = this.props;
        const { selectedBrowser } = this.state;
        const user = await authorize();
        onChoose( { user } );
        folderPath = folderPath || ( selectedBrowser ? selectedBrowser.pathIds() : [] );
        let rootBrowser = await listFolders();
        const newFolderBrowsers = rootBrowser.walk( folderPath );
        const newSelectedBrowser = newFolderBrowsers[ newFolderBrowsers.length - 1 ];
        this.setState( {

            isLoading: undefined,
            selectedBrowser: newSelectedBrowser,
            folderBrowsers: newFolderBrowsers

        } );

    }

    handleFolderSelect( folderBrowser ) {

        const { onChoose } = this.props;
        onChoose( { folderBrowser } );

    }

    go( from, to ) {

        let folder = from.go( to );
        this.select( folder );
        return folder;

    }

    select( selectedBrowser ) {

        const folderBrowsers = [ selectedBrowser ];
        let walker = selectedBrowser;
        while( walker.back ) {

            walker = walker.back();
            folderBrowsers.unshift( walker );

        }
        this.setState( {

            folderBrowsers,
            selectedBrowser

        } );

    }

    renderControls() {

        const { isLoading } = this.state;
        const onRefreshFoldersClick = () => this.listFolders();
        const isRefreshDisabled = isLoading;
        return <div key="controls" className="controls">

            <button className="refreshFolders" onClick={onRefreshFoldersClick} disabled={isRefreshDisabled}>Refresh folders</button>

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
        this.setState( { isLoading: true } );
        try {

            const folderId = await createFolder( selectedBrowser, folderName );
            const newFolderPath = [ ...selectedBrowser.pathIds(), folderId ];
            this.listFolders( newFolderPath );

        } catch( err ) {

            this.setState( { isLoading: undefined, err } );

        }

    }

    renderSelectedDetail() {

        const { folderBrowsers, folderName } = this.state;
        const selectedBrowser = this.state.selectedBrowser || folderBrowsers[ folderBrowsers.length - 1 ];
        if ( !selectedBrowser ) return null;
        let path = selectedBrowser.path().slice( 0, -1 ).join( `\u200B/\u200B` );
        const { name, modified, id } = selectedBrowser.current;
        const formatted = modifyDate( modified );
        const onFolderNameChange = e => this.setState( { folderName: e.target.value } );
        const onCreateClick = () => this.createFolder();
        const onDeleteClick = () => this.deleteFolder();
        const onSelectClick = () => this.handleFolderSelect( selectedBrowser );
        const cancelSubmit = e => e.preventDefault();
        return id
            ?
            <div className="selected-folder" key="selected-folder">

                <h2>{path}/&shy;{name}</h2>
                <form onSubmit={cancelSubmit} className="select-folder">

                    <h3>Select this folder</h3>
                    {formatted && <div className="last-modified">Last modified: <span className="value">{formatted}</span></div>}
                    <button onClick={onSelectClick}>Select</button>

                </form>
                <form onSubmit={cancelSubmit} className="create-folder">

                    <h3>Create a new folder in this location</h3>
                    {path}/&shy;{name}/&shy;<input type="text" onChange={onFolderNameChange} value={folderName} placeholder="Folder name" />
                    <button onClick={onCreateClick}>Create</button>


                </form>
                <form onSubmit={cancelSubmit} className="delete-folder">

                    <h3>Delete this folder</h3>
                    <div className="path-and-name">{path}/&shy;{name}</div>
                    <button onClick={onDeleteClick}>Delete</button>

                </form>

            </div>
            :
            <div className="selected-folder" key="selected-folder">

                <h3>No folder selected</h3>

            </div>;

    }

    renderLoading() {

        return <div className="folder-list-loading" key="folder-list-loading">loading...</div>;

    }

    renderPicker() {

        const { isLoading } = this.state;
        return [

            isLoading ? this.renderLoading() : null,
            this.renderControls(),
            this.renderSelectedDetail(),
            this.renderFolderList()

        ];

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
