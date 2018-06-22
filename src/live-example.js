import React, { Component } from "react";
import { render } from "react-dom";

import "./live-example.scss";

import SampleDataForm from "./SampleDataForm";

import { X } from "./";

class LiveExample extends Component {

    render() {

        return <article className="live-example">

            <SampleDataForm />

        </article>;

    }

}

export const renderLiveExample = selector =>

    render(

        <LiveExample />,
        document.querySelector( selector )

    );

