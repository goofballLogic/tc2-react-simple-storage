import BrowseList from "../BrowseList";

window.addEventListener( "DOMContentLoaded", () => {

    if ( !window.gapi ) {

        if ( !document.querySelector( ".google-api-loader" ) ) {

            const loader = document.createElement( "SCRIPT" );
            loader.src = "https://apis.google.com/js/api.js";
            loader.className = "google-api-loader";
            document.querySelector( "head" ).appendChild( loader );

        }

    }

} );

function loadGoogleAPI() {

    return window.gapi ? Promise.resolve( window.gapi ) : new Promise( ( resolve, reject ) => {

        const waitingForGapi = window.setInterval( () => {

            if ( window.gapi ) {

                window.clearInterval( waitingForGapi );
                window.clearTimeout( waitingForGodo );
                resolve( window.gapi );

            }

        }, 100 );
        const waitingForGodo = setTimeout( () => {

            window.clearInterval( waitingForGapi );
            reject( "Failed to load Google API" );

        }, 30000 );

    } );

}

const initializing = loadGoogleAPI();
export { initializing };

function buildProfile( gapi ) {

    const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    if ( !profile ) { return profile; }
    const name = profile.getName();
    const email = profile.getEmail();
    const id = profile.getId();
    return { id, name, email };

}

export async function authorize() {

    const gapi = await loadGoogleAPI();
    await new Promise( resolve => gapi.load( "client:auth2", resolve ) );
    await gapi.client.init( {

        apiKey: "AIzaSyBA5vt92PND_bNslesdICGLy6qv3Q8c8BA",
        clientId: "703171357255-6qbavnijqqdft8ckvq85gtane6c3d82u.apps.googleusercontent.com",
        discoveryDocs: [ "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest" ],
        scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly"

    } );
    const profile = buildProfile( gapi );
    if ( profile ) return profile;
    return gapi.auth2.getAuthInstance().signIn().catch( ex => {

        if ( ex && "popup_blocked_by_browser" === ex.error ) {

            alert( "You need to allow popups from this site in order to use Google Drive" );

        } else {

            throw ex;

        }

    } ).then( () => buildProfile( gapi ) );

}

function asFile( googleFile ) {

    const { id, name, parents, iconLink, modifiedTime } = googleFile;
    return { id, name, parents, icon: iconLink, modified: modifiedTime };

}

export async function listFolders( client ) {

    const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
    const response = await client.drive.files.list( {

        pageSize: 999,
        q: `mimeType='${FOLDER_MIME_TYPE}'`,
        fields: 'files(id, name, parents, iconLink, modifiedTime)'

    } );

    const { top, childIndex } = response.result.files.reduce( ( ret, file ) => {

        const parents = file.parents || [];
        if ( parents.length < 1 ) ret.top.push( file );
        for( const parentId of parents ) {

            ret.childIndex[ parentId ] = ( ret.childIndex[ parentId ] || [] ).concat( [ asFile( file ) ] );

        }
        return ret;

    }, { top: [], index: {}, childIndex: {} } );

    const traversal = item => [ childIndex[ item.id ], traversal ];
    return new BrowseList( top, traversal );

    return response.result.files.map(   );

}