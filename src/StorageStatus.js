import React from "react";

const StorageStatus = ( { context = {} } ) => <article className="storage-status">

    <span>Storage:</span>
    <span className={`connection ${context.connected ? "" : "dis"}connected` }>

        {context.connected ? "Connected" : "Not connected"}

    </span>

</article>;

export { StorageStatus };
