import React, { Component } from "react";

class ErrorBoundary extends Component {

    constructor() {

        super();
        this.state = {};

    }

    componentDidCatch(error, info) {

        this.setState( { error, info } );

    }

    render() {

        if ( !this.state.error ) {

            return this.props.children;

        }
        console.log( this.state.error, this.state.info );
        return <section className="error">

            <h3>An error has occurred: {this.state.error.message}</h3>
            <pre>

                {this.state.error.stack}

            </pre>
            <p>You may reload to try again: <button onClick={() => window.location.reload()}>Reload</button></p>

        </section>;

    }

}

export default ErrorBoundary;
