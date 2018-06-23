async function InitializeGAPI() {

    return new Promise( ( resolve ) => {

        setTimeout( () => resolve( 42 ), 3000 );

    } );

}

const initializing = InitializeGAPI();
export { initializing };

window.addEventListener( "DOMContentLoaded", () => {


} );
