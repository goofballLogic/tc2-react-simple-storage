import React, { Component } from "react";
import { PROVIDER_QUERY } from "../messages";
import Icon from "./icon.svg";
import Provider from "./Provider";
import { uploadAsJSON, downloadParsedJSON } from "./google-drive-logic";

const PROVIDER_NAME = "My Google Drive";
const PROVIDER_ID = "google-drive-storage-provider-2018-06";
const PROVIDER_CLASS = "google-drive-storage-provider";

document.addEventListener( PROVIDER_QUERY, handleQuery );

function handleQuery( { detail } ) {

    const { register } = detail;
    register( {

        id: PROVIDER_ID,
        name: PROVIDER_NAME,
        className: PROVIDER_CLASS,
        Icon,
        Provider,
        uploadAsJSON,
        downloadParsedJSON

    } );

}
