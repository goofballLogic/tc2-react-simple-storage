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

    if ( !gapi.auth2.getAuthInstance().isSignedIn.get() ) return null;
    const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    if ( !profile ) { return profile; }
    const name = profile.getName();
    const email = profile.getEmail();
    const id = profile.getId();
    return { id, name, email };

}

export async function deauthorize() {

    const auth = ( await loadGoogleAPI() ).auth2.getAuthInstance();
    auth.signOut();
    auth.disconnect();

}

export async function authorize() {

    const gapi = await loadGoogleAPI();

    await new Promise( resolve => gapi.load( "client:auth2", resolve ) );
    await gapi.client.init( {

        apiKey: window.apiKey || "AIzaSyBA5vt92PND_bNslesdICGLy6qv3Q8c8BA",
        clientId: window.clientId || "703171357255-6qbavnijqqdft8ckvq85gtane6c3d82u.apps.googleusercontent.com",
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

function ensureSuccessStatus( response, description, maybeOptions ) {

    if ( response.status === 200 ) return;
    console.error( response, description, maybeOptions || "options not specified" );
    throw new Error( `Unexpected response status: ${response.status} ${description ? `(${description})` : ""}` );

}

const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

export async function listFolders() {

    const gapi = await loadGoogleAPI();
    const filesClient = gapi.client.drive.files;
    const listOptions = {

        pageSize: 999,
        q: `mimeType='${FOLDER_MIME_TYPE}' and trashed = false`,
        fields: 'files(id, name, parents, iconLink, modifiedTime)'

    };
    const getOptions = {

        fileId: "root"

    };
    const [ foldersResponse, rootResponse ] = await Promise.all( [

        filesClient.list( listOptions ),
        filesClient.get( getOptions )

    ] );
    ensureSuccessStatus( foldersResponse, "Querying for all folders" );
    ensureSuccessStatus( rootResponse, "Querying for root folder" );
    const working = {

        top: [ asFile( rootResponse.result ) ],
        index: {},
        childIndex: {}

    };
    const { top, childIndex } = foldersResponse.result.files.reduce( ( ret, file ) => {

        const parents = file.parents || [];
        if ( parents.length < 1 ) ret.top.push( file );
        for( const parentId of parents ) {

            ret.childIndex[ parentId ] = ( ret.childIndex[ parentId ] || [] ).concat( [ asFile( file ) ] );

        }
        return ret;

    }, working );

    const traversal = item => [ childIndex[ item.id ], traversal ];
    return new BrowseList( top, traversal );

}

export async function createFolder( browseList, folderName ) {

    const gapi = await loadGoogleAPI();
    const options = {

        name: folderName,
        mimeType: FOLDER_MIME_TYPE,
        fields: "id",
        parents: [ browseList.current.id ]

    };
    const response = await gapi.client.drive.files.create( options );
    ensureSuccessStatus( response );
    return response.result.id;

}

export async function deleteFolder( browseList ) {

    const gapi = await loadGoogleAPI();
    const response = await gapi.client.drive.files.delete( { fileId: browseList.current.id } );
    return response.result.id;

}

const createMultipartRelatedBody = (

    metadata,
    mediaContentType,
    media,
    boundary

) => `

--${boundary}
Content-Type: application/json; charset=UTF-8

${JSON.stringify( metadata )}

--${boundary}
Content-Type: ${mediaContentType}

${media}
--${boundary}--

`;

function reportError( message, err, maybeOptions ) {
    
    throw new Error( 
        
        "Error ${message}: ${err && err.stack ? err.stack : err}"
        + maybeOptions ? `\n\n${JSON.stringify( maybeOptions, null, 3 )}` : ""
        
    );

}

export async function uploadAsJSON( browseList, filename, obj, fileId ) {

    const json = JSON.stringify( obj );
    const gapi = await loadGoogleAPI();
    if ( !fileId ) {

        // attempt to look up id
        const found = await findFile( browseList, filename );
        if ( found ) fileId = found.id;

    }
    const path = `/upload/drive/v3/files${fileId ? `/${fileId}` : ""}`;
    const method = fileId ? "PATCH" : "POST";
    const params = { "uploadType": "multipart" };
    const metadata = {

        name: filename,
        mimeType: "application/json",

    };
    if ( fileId ) {

        metadata.addParents = [ browseList.current.id ];

    } else {

        metadata.parents = [ browseList.current.id ];

    }
    const boundary = `tc2-react-simple-storage-${Date.now()}`;
    const body = createMultipartRelatedBody( metadata, "application/json", json, boundary );
    const headers = {

        "content-type": `multipart/related; boundary=${boundary}`

    };
    const options = { path, method, params, headers, body };
    try {

        const uploadResponse = await gapi.client.request( options );
        ensureSuccessStatus( uploadResponse, `Uploading ${filename}`, options );
        
    } catch( err ) {
        
        reportError( "uploading JSON", err, options );
        
    }

}

async function findFile( browseList, filename ) {

    if ( !browseList.current ) throw new Error( "No current folder supplied" );
    const options = {

        pageSize: 1,
        q: [
            `"${browseList.current.id}" in parents`,
            `name = "${filename}"`,
            "trashed = false"
        ].join( " and " ),
        fields: 'files(id)'

    };
    try {

        const gapi = await loadGoogleAPI();
        const findResponse = await gapi.client.drive.files.list( options );
        ensureSuccessStatus( findResponse, `Searching for ${filename}` );
        const { files } = findResponse.result;
        return files[ 0 ];
        
    } catch( err ) {
        
        reportError( "finding file", err, options );
        
    }

}

export async function downloadParsedJSON( browseList, filename ) {

    const gapi = await loadGoogleAPI();
    const found = await findFile( browseList, filename );
    if ( !found ) return null;
    const getResponse = await gapi.client.drive.files.get( {

        fileId: found.id,
        alt: "media"

    } );
    ensureSuccessStatus( getResponse, `Fetching ${filename}` );
    return getResponse.result;

}

export async function listFiles( browseList = { current: { id: "root" } }, mimeType ) {

    const gapi = await loadGoogleAPI();
    const query = [
        `"${browseList.current.id}" in parents`,
        "trashed = false"
    ];
    if ( mimeType ) query.push( `mimeType='${mimeType}'` );
    const findResponse = await gapi.client.drive.files.list( {

        pageSize: 999,
        q: query.join( " and " ),
        fields: 'files(id, name, mimeType, modifiedTime)'

    } );
    ensureSuccessStatus( findResponse, `Listing contents of ${browseList}` );
    return findResponse.result.files;

}

export async function refresh( browseList ) {

    if ( !browseList ) throw new Error( "Missing argument: browseList" );
    browseList.list = await listFiles( browseList, FOLDER_MIME_TYPE );
    return browseList;

}
