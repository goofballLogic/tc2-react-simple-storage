import React from "react";

const StorageStatus = ( { context = {} } ) => <article className="storage-status">

    <span>Storage:</span>
    <span className={`connection ${context.connected ? "" : "dis"}connected` }>

        {context.connected ? "Connected" : "Not connected"}

    </span>
    {context.provider && <span className="provider-name">

        {context.provider.name }

    </span>}
    {context.connected && context.selectedFolder && <span className="selected-folder">

        {context.selectedFolder.path().join( "/" )}

    </span>}

</article>;

export { StorageStatus };
