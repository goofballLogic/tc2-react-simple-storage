import React, { Component } from "react";

import "./SampleDataForm.scss";

class SampleDataForm extends Component {

    constructor() {

        super();
        this.state = { data: { name: "", thoughts: "" } };

    }

    handleSubmit( e ) {

        const { onSave } = this.props;
        if ( !onSave ) return;
        e.preventDefault();
        onSave( this.state.data );

    }

    handleChange( e, prop ) {

        const { data } = this.state;
        const value = e.target.value;
        this.setState( {

            data: { ...data, [ prop ]: value }

        } );

    }

    render() {

        const { data } = this.state;
        return <form className="sample-data-form" onSubmit={e => this.handleSubmit( e )}>

            <label>

                <span className="label-text">Name</span>
                <input name="name"
                    value={data.name}
                    onChange={e => this.handleChange( e, "name" )}
                    placeholder="Enter your name..." />

            </label>
            <label>

                <span className="label-text">Thoughts</span>
                <textarea name="thoughts"
                    value={data.thoughts}
                    onChange={e => this.handleChange( e, "thoughts" )}
                    placeholder="Enter your thoughts here..."></textarea>

            </label>
            <button>Save</button>

        </form>

    }

}

export default SampleDataForm;