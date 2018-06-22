import React, { Component } from "react";
import { render } from "react-dom";

import { X } from "./";

const LiveExample = () => <article className="live-example">

    { X() }
    
</article>;

export const renderLiveExample = selector => 

    render( 
    
        <LiveExample />,
        document.querySelector( selector )
    
    );

