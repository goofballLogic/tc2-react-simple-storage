/*global CustomEvent*/

export const PROVIDER_QUERY = "storage-provider-query";

export function queryProviders() {

    return new Promise( ( resolve, reject ) => {

        const providers = [];
        const registerProvider = provider => providers.includes( provider ) || providers.push( provider );
        const evt = new CustomEvent( PROVIDER_QUERY, { detail: { register: registerProvider }, bubbles: true } );
        document.querySelector( "body" ).dispatchEvent( evt );
        setTimeout( () => {

            if ( providers.length ) {

                resolve( providers );

            } else {

                reject( new Error( "No providers found" ) );

            }

        }, 200 );

    } );

}
