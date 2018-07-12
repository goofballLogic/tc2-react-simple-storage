import React from "react";

const StorageStatus = ( { context = {} } ) => console.log( context ) || <article className="storage-status">

    <span>Storage:</span>
    <span className={`connection ${context.connected ? "" : "dis"}connected` }>

        {context.connected ? "Connected" : "Not connected"}

    </span>
    {context.provider && <span>

        {context.provider.name }

    </span>}

</article>;

export { StorageStatus };
