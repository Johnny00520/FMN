import React, { Component } from 'react'
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { 
    saveOrg,
    fetchExistingNonOrg,
    updateOrg
} from '../../../../../actions/nonOrgImageCRUD';

export class NonOrgsImageForm extends Component {
    state = {
        _id: this.props.nonOrg ? this.props.nonOrg._id : null,
        org_name: this.props.nonOrg ? this.props.nonOrg.org_name : '',
        org_description: this.props.nonOrg ? this.props.nonOrg.org_description : '',
        org_web_address: this.props.nonOrg ? this.props.nonOrg.org_web_address : '',
        selectedFile: null,
        loading: false,
        done: false,
        errors: {}
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            _id: nextProps.nonOrg._id,
            org_name: nextProps.nonOrg.org_name,
            org_description: nextProps.nonOrg.org_description,
            org_web_address: nextProps.nonOrg.org_web_address
        })
    }

    componentDidMount = () => {
        if(this.props.params) {
            this.props.fetchExistingNonOrg(this.props.params)
        }
    }

    handleChange = e => {
        if(!!this.state.errors[e.target.name]) {
            let errors = Object.assign({}, this.state.errors );
            delete errors[e.target.name];
    
            this.setState({ 
                [e.target.name]: e.target.value,
                errors
            });
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    fileHandleChange = (e) => {
        console.log(e.target.files)
        this.setState({
            selectedFile: e.target.files[0]
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};
        if(this.state.org_name === '') errors.org_name = 'Cannot be empty';
        if(this.state.org_description === '') errors.org_description = 'Cannot be empty';
        if(this.state.org_web_address === '') errors.org_web_address = 'Cannot be empty';

        this.setState({ errors });
        const isValid = Object.keys(errors).length === 0;

        if(isValid) {
            const {
                _id,
                org_name,
                org_description,
                org_web_address,
                selectedFile
            } = this.state;

            if(_id) {
                this.props.updateOrg({ 
                    _id,
                    org_name,
                    org_description,
                    org_web_address,
                    selectedFile
                })
                .then(() => { this.setState({ done: true })}, (err) => err.response.json()
                .then(({ errors }) => this.setState({ errors, loading: false }) ))

            } else {

                this.setState({ loading: true })
                this.props.saveOrg({ org_name, org_description, org_web_address, selectedFile})
                .then(() => { this.setState({ done: true })}, (err) => err.response.json()
                .then(({ errors }) => this.setState({ errors, loading: false }) ))
            }
        }
    }

    render() {

        const form = (
            <form className={classnames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>

                <div className="fields-container">
                    <h1>Add new non profit organization</h1>

                    {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

                    <div className={classnames('field', { error: !!this.state.errors.org_name })}>
                        <label htmlFor="orgName">Organization Name *</label>
                        <input
                            name="org_name"
                            value={this.state.org_name || ''}
                            onChange={this.handleChange}
                            id="orgName"
                        />
                        <span>{this.state.errors.org_name}</span>
                    </div>

                    <div className={classnames('field', { error: !!this.state.errors.org_description })}>
                        <label htmlFor="org_description">Organization description *</label>
                        <textarea
                            name="org_description"
                            id="org_description"
                            value={this.state.org_description || ''}
                            onChange={this.handleChange}
                        />
                        <span>{this.state.errors.org_description}</span>
                    </div>

                    <div className="field">
                        <label htmlFor="file">Picture: (Only support .jpg .jpeg .png) *</label>
                        <input 
                            type="file"
                            encType="multipart/form-data"
                            id="file"
                            name="image"
                            accept="image/*"
                            onChange={this.fileHandleChange}
                        />
                    </div>

                    <div className={classnames('field', { error: !!this.state.errors.org_web_address })}>
                        <label htmlFor="org_web_address">Organization website address *</label>
                        <input
                            name="org_web_address"
                            id="org_web_address"
                            value={this.state.org_web_address || ''}
                            onChange={this.handleChange}
                        />
                        <span>{this.state.errors.org_web_address}</span>
                    </div>

                    <div className="field">
                        <button className="ui primary button">Save</button>
                    </div>

                </div>
            </form>
        )
        return (
            <div>
                {this.state.done ? <Redirect to="/image_panel/allImagesList" /> : form }
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    if(props.params) {
        return {
            nonOrg: state.nonOrgsImages.find(item => item._id === props.params)
        }
    }

    return { nonOrg: null }
}

export default connect(mapStateToProps, {
    saveOrg,
    fetchExistingNonOrg,
    updateOrg
})(NonOrgsImageForm);
