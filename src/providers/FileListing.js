import React, { Component } from "react";

class FileListing extends Component {

    constructor() {

        super();
        this.state = {};

    }

    componentDidUpdate( prevProps ) {

        if ( prevProps.context !== this.props.context ) {

            this.resetFileListing();
            return;

        }
        if ( !this.props.context ) {

            return;

        }
        if ( prevProps.context.selectedFolder !== this.props.context.selectedFolder ) {

            this.resetFileListing();
            return;

        }

    }

    async resetFileListing() {

        const { context } = this.props;
        if ( !context ) {

            // no save context yet
            this.setState( { files: undefined } );
            return;

        }

        const { selectedFolder, provider, connected } = context;
        const selected = selectedFolder && selectedFolder.current;
        if ( connected && this.state.selectedFolder && this.state.selectedFolder.current.id === selected.id ) {

            // still listing current folder
            return;

        }
        if ( !connected || !selected ) {

            // check we aren't listing a stale folder
            this.setState( { files: undefined } );
            return;

        }

        // refresh the file list
        this.setState( {

            selectedFolder,
            files: await provider.listFiles( selectedFolder )

        } );

    }

    renderFileList() {

        const { files } = this.state;
        return <ul>

            {files.map( file => (<li key={file.id}>

                <span className="filename">{file.name}</span>
                <span className="modified">{file.modifiedTime}</span>

            </li>) ) }

        </ul>;

    }

    renderNoFiles() {

        return <div>No files</div>;

    }

    renderFiles() {

        const { selectedFolder, files } = this.state;
        return selectedFolder ? <article className="file-listing">

            <h3>{selectedFolder.path().join( "/" )}</h3>
            {files.length ? this.renderFileList() : this.renderNoFiles()}

        </article> : null;

    }

    render() {

        const { files } = this.state;
        return files ? this.renderFiles() : null;

    }

}

export { FileListing };