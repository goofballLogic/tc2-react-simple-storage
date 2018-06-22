import React, { Component } from "react";

class ErrorBoundary extends Component {

    constructor() {

        super();
        this.state = {};

    }

    componentDidCatch(error, info) {

        this.setState( { error, info } );

    }

    renderInfo() {

        if ( !this.state.info ) return;
        return <pre>

            {JSON.stringify( this.state.info, null, 3 )}

        </pre>;

    }

    render() {

        if ( !this.state.error ) {

            return this.props.children;

        }
        return <section className="error">

            <pre>

                {JSON.stringify( this.state.error, null, 3 )}

            </pre>
            {this.renderInfo()}

        </section>;

    }

}

export default ErrorBoundary;
