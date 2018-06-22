import React, { Component } from "react";
import { render } from "react-dom";

import "./live-example.scss";

import SampleDataForm from "./SampleDataForm";
import ErrorBoundary from "./ErrorBoundary";
import { StorageStatus } from "./";

const LiveExample = () => <article className="live-example">

    <ErrorBoundary>

        <StorageStatus />
        <SampleDataForm />

    </ErrorBoundary>

</article>;


export const renderLiveExample = selector =>

    render(

        <LiveExample />,
        document.querySelector( selector )

    );

