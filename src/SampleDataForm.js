import React, { Component } from "react";

import "./SampleDataForm.scss";

class SampleDataForm extends Component {

    constructor() {

        super();
        this.state = { name: "", thoughts: "" };

    }

    handleSubmit( e ) {

        e.preventDefault();

    }

    handleChange( e, prop ) {

        const value = e.target.value;
        this.setState( { [ prop ]: value } );

    }

    render() {

        return <form className="sample-data-form" onSubmit={e => this.handleSubmit( e )}>


            <label>

                <span className="label-text">Name</span>
                <input name="name"
                    value={this.state.name}
                    onChange={e => this.handleChange( e, "name" )}
                    placeholder="Enter your name..." />

            </label>
            <label>

                <span className="label-text">Thoughts</span>
                <textarea name="thoughts"
                    value={this.state.thoughts}
                    onChange={e => this.handleChange( e, "thoughts" )}
                    placeholder="Enter your thoughts here..."></textarea>

            </label>
            <button>Save</button>

        </form>

    }

}

export default SampleDataForm;