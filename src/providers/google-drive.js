import { PROVIDER_QUERY } from "./messages";
import Icon from "./google-drive.svg";

const PROVIDER_NAME = "My Google Drive";
const PROVIDER_ID = "google-drive-storage-provider-2018-06";

document.addEventListener( PROVIDER_QUERY, handleQuery );

function handleQuery( { detail } ) {

    const { register } = detail;
    register( {

        id: PROVIDER_ID,
        name: PROVIDER_NAME,
        Icon

    } );

}
