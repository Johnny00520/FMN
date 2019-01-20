import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import './AdminImageForm.css';
import { 
    updateAdmin,
    fetchExistingAdmin,
    saveAdmin
} from '../../../../../actions/adminImageCRUD';

class AdminImageForm extends Component {
    state = {
        _id: this.props.admin ? this.props.admin._id : null,
        firstname: this.props.admin ? this.props.admin.firstname : '',
        lastname: this.props.admin ? this.props.admin.lastname : '',

        email: this.props.admin ? this.props.admin.email: '',
        websiteAddress: this.props.admin ? this.props.admin.websiteAddress: '',
        facebook: this.props.admin ? this.props.admin.facebook: '',
        otherLink1: this.props.admin ? this.props.admin.otherLink1: '',
        otherLink2: this.props.admin ? this.props.admin.otherLink2: '',
        otherLink3: this.props.admin ? this.props.admin.otherLink3: '',
        pleage1: this.props.admin ? this.props.admin.pleage1: '',
        pleage1Percent: this.props.admin ? this.props.admin.pleage1Percent : '',
        pleage2: this.props.admin ? this.props.admin.pleage2: '',
        pleage2Percent: this.props.admin ? this.props.admin.pleage2Percent : '',
        notes: this.props.admin ? this.props.admin.notes : '',

        selectedFile: null,
        errors: {},
        loading: false,
        done: false,
    }

    componentWillReceiveProps = (nextProps) => {
        // debugger
        this.setState({
            _id: nextProps.admin._id,
            firstname: nextProps.admin.firstname,
            lastname: nextProps.admin.lastname,
            email: nextProps.admin.email,
            websiteAddress: nextProps.admin.websiteAddress,
            facebook: nextProps.admin.facebook,
            otherLink1: nextProps.admin.otherLink1,
            otherLink2: nextProps.admin.otherLink2,
            otherLink3: nextProps.admin.otherLink3,
            pleage1: nextProps.admin.pleage1,
            pleage2: nextProps.admin.pleage2,
            pleage1Percent: nextProps.admin.pleage1Percent,
            pleage2Percent: nextProps.admin.pleage2Percent,
            notes: nextProps.admin.notes
            // selectedFile: nextProps.admin.userImagaPath
        })
    }

    componentDidMount = () => {
        if(this.props.params) {
            this.props.fetchExistingAdmin(this.props.params);
        }
    }

    handleChange = (e) => {
        
        if(!!this.state.errors[e.target.name]) {
            let errors = Object.assign({}, this.state.errors);
            delete errors[e.target.name];
    
            this.setState({ 
                [e.target.name]: e.target.value,
                errors
            });
        } else {
            this.setState({ 
                [e.target.name]: e.target.value,
            });
        }
    }

    fileHandleChange = (e) => {
        this.setState({
            selectedFile: e.target.files[0]
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};
        if(this.state.firstname === '') errors.firstname = 'Cannot be empty';
        if(this.state.lastname === '') errors.lastname = 'Cannot be empty';
        if(this.state.email === '') errors.email = 'Cannot be empty';
        if(this.state.notes === '') errors.notes = 'Cannot be empty';

        this.setState({ errors });
        const isValid = Object.keys(errors).length === 0;

        if(isValid) {
            const { 
                _id, 
                selectedFile, 
                firstname, 
                lastname,
                email,
                websiteAddress,
                facebook,
                otherLink1,
                otherLink2,
                otherLink3,
                pleage1,
                pleage1Percent,
                pleage2,
                pleage2Percent,
                notes
            } = this.state;

            this.setState({ loading: true });

            if(_id) {
                this.props.updateAdmin({ 
                    _id, 
                    selectedFile, 
                    firstname, 
                    lastname,
                    email,
                    websiteAddress,
                    facebook,
                    otherLink1,
                    otherLink2,
                    otherLink3,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent,
                    notes
                })
                .then(() => { this.setState({ done: true })}, 
                (err) => err.response.json()
                .then(({errors}) => this.setState({ errors, loading: false })))

            } else {
                this.props.saveAdmin({
                    _id, 
                    selectedFile, 
                    firstname, 
                    lastname,
                    email,
                    websiteAddress,
                    facebook,
                    otherLink1,
                    otherLink2,
                    otherLink3,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent,
                    notes
                })
                .then(() => { this.setState({ done: true })}, 
                (err) => err.response.json()
                .then(({errors}) => this.setState({ errors, loading: false })))
            }
        }
    }

    render() {

        const form = (
            <div className="ui container">
   
                <form className={classnames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
                    <h1>Add/Update a new admin</h1>

                    {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

                    <div className="two fields">
                        <div className={classnames('field', {error: !!this.state.errors.firstname })}>
                            <label htmlFor="firstname">First Name *</label>
                            <input
                                name="firstname"
                                value={this.state.firstname || ''}
                                onChange={this.handleChange}
                                id="firstname"
                                placeholder="Enter first name..."
                            />
                            <span className="error-msg-color">{this.state.errors.firstname}</span>
                        </div>

                        <div className={classnames('field', {error: !!this.state.errors.lastname })}>
                            <label htmlFor="lastname">Last Name *</label>
                            <input
                                name="lastname"
                                value={this.state.lastname || ''}
                                onChange={this.handleChange}
                                id="lastname"
                                placeholder="Enter last name..."
                            />
                            <span className="error-msg-color">{this.state.errors.lastname}</span>
                        </div>
                    </div>

                    <div className={classnames('field', {error: !!this.state.errors.email })}>
                        <label htmlFor="email">Email *</label>
                        <input
                            name="email"
                            value={this.state.email || ''}
                            onChange={this.handleChange}
                            id="email"
                            placeholder="Enter email address..."
                        />
                        <span className="error-msg-color">{this.state.errors.email}</span>
                    </div>

                    <div className="field">
                        <label htmlFor="file">Picture: (Only support .jpg .jpeg .png)</label>
                        <input 
                            type="file"
                            encType="multipart/form-data"
                            id="file"
                            name="image"
                            accept="image/*"
                            onChange={this.fileHandleChange}
                        />
                    </div>

                    <div className={classnames('field', {error: !!this.state.errors.websiteAddress })}>
                        <label htmlFor="websiteAddress">Website Address</label>
                        <input
                            name="websiteAddress"
                            value={this.state.websiteAddress || ''}
                            onChange={this.handleChange}
                            id="websiteAddress"
                            placeholder="Enter website..."
                        />
                        <span className="error-msg-color">{this.state.errors.websiteAddress}</span>
                    </div>

                    <div className={classnames('field', {error: !!this.state.errors.facebook })}>
                        <label htmlFor="facebook">Facebook</label>
                        <input
                            name="facebook"
                            value={this.state.facebook || ''}
                            onChange={this.handleChange}
                            id="facebook"
                            placeholder="Enter facebook..."
                        />
                        <span className="error-msg-color">{this.state.errors.facebook}</span>
                    </div>

                    <div className="field">
                        <label htmlFor="otherLink1">Other links</label>
                        <input 
                            id="otherLink1"
                            name="otherLink1"
                            placeholder="Enter the first additional link if you have..."
                            onChange={this.handleChange}
                            value={this.state.otherLink1}
                        />
                    </div>
                    <div className="field">
                        <input 
                            id="otherLink2"
                            name="otherLink2"
                            placeholder="Enter the second additional link if you have..."
                            onChange={this.handleChange}
                            value={this.state.otherLink2}

                        />
                    </div>
                    <div className="field">
                        <input 
                            id="otherLink3"
                            name="otherLink3"
                            placeholder="Enter the third additional link if you have..."
                            onChange={this.handleChange}
                            value={this.state.otherLink3}
                        />
                    </div>

                    <label htmlFor="pleages">Pleages</label>
                    <div className="two fields">
                        <div className="field">
                            <input
                                id="pleages"
                                name="pleage1"
                                placeholder="Enter the first pleage if you have any..."
                                onChange={this.handleChange}
                                value={this.state.pleage1}
                            />
                        </div>
                        <div className="field">
                            <input
                                name="pleage1Percent"
                                placeholder="How many %?"
                                onChange={this.handleChange}
                                value={this.state.pleage1Percent}
                            />
                        </div>
                    </div>

                    <div className="two fields">
                        <div className="field">
                            <input
                                name="pleage2"
                                placeholder="Enter the second pleage if you have any..."
                                onChange={this.handleChange}
                                value={this.state.pleage2}
                            />
                        </div>
                        <div className="field">
                            <input
                                name="pleage2Percent"
                                placeholder="How many %?"
                                onChange={this.handleChange}
                                value={this.state.pleage2Percent}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="notes">Notes *</label>
                        <textarea
                            rows="4"
                            id="notes"
                            name="notes"
                            placeholder="Any note about the new admin?"
                            onChange={this.handleChange}
                            value={this.state.notes || ''}
                        />
                    </div>

                    <div className="field">
                        <button className="ui primary button">Save</button>
                    </div>

                </form>
            </div>
        )

        return(
            <div>
                { this.state.done ? <Redirect to="/image_panel/allImagesList" /> : form }
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    if(props.params) {
        return {
            admin: state.adminImages.find( item => item._id === props.params )
        }
    }
    return { admin: null }
}

export default connect(mapStateToProps, { 
    updateAdmin, 
    fetchExistingAdmin,
    saveAdmin
})(AdminImageForm);