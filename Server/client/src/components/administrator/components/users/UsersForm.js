import React, { Component } from 'react';
import classNames from 'classnames';
import './common.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import * as actions from '../../../../actions/usersListCRUD';


class UsersForm extends Component {

    state = {
        _id: this.props.user ? this.props.user._id : null,
        firstname: this.props.user ? this.props.user.firstname : '',
        lastname: this.props.user ? this.props.user.lastname : '',
        email: this.props.user ? this.props.user.email : '',
        contributor: this.props.user ? this.props.user.contributor : '',
        websiteAddress: this.props.websiteAddress ? this.props.user.websiteAddress : '',
        facebook: this.props.facebook ? this.props.user.facebook : '',
        notes: this.props.notes ? this.props.user.notes : '',
        otherLink1: this.props.otherLink1 ? this.props.user.otherLink1 : '',
        otherLink2: this.props.otherLink2 ? this.props.user.otherLink2 : '',
        otherLink3: this.props.otherLink3 ? this.props.user.otherLink3 : '',
        pleage1: this.props.pleage1 ? this.props.user.pleage1 : '',
        pleage1Percent: this.props.pleage1Percent ? this.props.user.pleage1Percent : '',
        pleage2: this.props.pleage2 ? this.props.user.pleage2 : '',
        pleage2Percent: this.props.pleage2Percent ? this.props.user.pleage2Percent : '',
        errors: {},
        loading: false,
        done: false,
        selectedFile: null,
        arrayFiles: [],
    };

    componentWillReceiveProps = (nextProps) => {
        // debugger
        this.setState({
            _id: nextProps.user._id,
            firstname: nextProps.user.lastname,
            lastname: nextProps.user.firstname,
            email: nextProps.user.email,
            contributor: nextProps.user.contributor === "artist" ? "artist": "admin",
            websiteAddress: nextProps.user.websiteAddress,
            facebook: nextProps.user.facebook,
            notes: nextProps.user.notes,
            otherLink1: nextProps.user.otherLink1,
            otherLink2: nextProps.user.otherLink2,
            otherLink3: nextProps.user.otherLink3,
            pleage1: nextProps.user.pleage1,
            pleage1Percent: nextProps.user.pleage1Percent,
            pleage2: nextProps.user.pleage2,
            pleage2Percent: nextProps.user.pleage2Percent
        });
    }

    componentDidMount = () => {
        if(this.props.paramsMatch) {
            // debugger
            this.props.fetchExistingUser(this.props.paramsMatch);
        }
    }

    handleClick = () => {
        this.setState({ contributor: '' });
    }

    handleChange = (e) => {
        if(!!this.state.errors[e.target.name]) {

            let errors = Object.assign({}, this.state.errors);
            delete errors[e.target.name];

            this.setState({
                [e.target.name]: e.target.value,
                errors
            })

            if(e.target.type === 'radio'){
                this.setState({ contributor: e.target.value || ''});
            }

        } else {
            this.setState({ 
                [e.target.name]: e.target.value,
            });
            if(e.target.type === 'radio'){
                this.setState({ contributor: e.target.value || ''});
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};
        if(this.state.firstname === '') errors.firstname = "Cannot be empty";
        if(this.state.lastname === '') errors.lastname = "Cannot be empty";
        if(this.state.email === '') errors.email = "Cannot be empty";
        if(this.state.contributor === '') errors.contributor = "Cannot be empty";
        if(this.state.notes === '') errors.notes = "Notes cannot be empty";

        this.setState({ errors });

        // it's valid
        const isValid = Object.keys(errors).length === 0;

        if(isValid) {
            const { 
                _id, 
                firstname, 
                lastname, 
                email, 
                contributor, 
                notes, 
                websiteAddress, 
                otherLink1, 
                otherLink2, 
                otherLink3,
                facebook,
                pleage1,
                pleage1Percent,
                pleage2,
                pleage2Percent
            } = this.state;

            this.setState({ loading: true })

            if(_id) {
                this.props.updateUser({
                    _id, 
                    firstname, 
                    lastname, 
                    email, 
                    contributor, 
                    notes, 
                    websiteAddress, 
                    otherLink1, 
                    otherLink2, 
                    otherLink3,
                    facebook,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent
                }).then(
                    //success
                    () => { this.setState({ done: true }) },
                    //fail
                    (err) => {
                        console.log("err: ", err);
                        err.response.json().then(({errors}) => this.setState({ errors, loading: false }))
                    }
                );

            } else {
                this.props.newUserSave({ 
                    firstname, 
                    lastname, 
                    email, 
                    contributor, 
                    notes, 
                    websiteAddress, 
                    otherLink1, 
                    otherLink2, 
                    otherLink3,
                    facebook,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent
                 }).then(
                    //success
                    () => { this.setState({ done: true }) },
                    //fail
                    (err) => {
                        console.log("err: ", err);
                        err.response.json().then(({errors}) => this.setState({ errors, loading: false }))
                    }
                );
            }
        }
    }

    render() {
        const form = (
            <form className={classNames('ui', 'form', {loading: this.state.loading})} onSubmit={this.handleSubmit}>

                <div className="fields-container">
                    <h1>Add new User</h1>

                    {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

                    <div className="ui equal width form">
                        <div className="fields">
                            <div className={classNames('field', {error: !!this.state.errors.firstname })}>
                                <label htmlFor="firstname">First Name *</label>
                                <input
                                    name="firstname"
                                    value={this.state.firstname || ''}
                                    onChange={this.handleChange}
                                    id="firstname"
                                />
                                <span className="error-msg-color">{this.state.errors.firstname}</span>
                            </div>

                            <div className={classNames('field', {error: !!this.state.errors.lastname })}>
                                <label htmlFor="lastname">Last Name *</label>
                                <input
                                    name="lastname"
                                    value={this.state.lastname || ''}
                                    onChange={this.handleChange}
                                    id="lastname"
                                />
                                <span className="error-msg-color">{this.state.errors.lastname}</span>
                            </div>
                        </div>

                        <span className="error-msg-color">{this.state.errors.email}</span>

                        <div className={classNames('field', {error: !!this.state.errors.email })}>
                            <label htmlFor="email">Email Address *</label>
                            <input
                                name="email"
                                value={this.state.email || ''}
                                onChange={this.handleChange}
                                id="email"
                            />
                        </div>


                         <div className="inline fields">
                            <div className={classNames('field', { error: !!this.state.errors.contributor })}>
                            <label style={{ fontSize: '15px'}}>Contributor*</label>
                                <div className="ui radio checkbox">
                                    <input 
                                        type="radio"
                                        tabIndex="0"
                                        className="hidden"
                                        id="admin"
                                        name="admin"
                                        value="admin"
                                        checked={this.state.contributor === 'admin' }
                                        onChange={this.handleChange}
                                        onClick={this.handleClick}
                                    />
                                    <label htmlFor="admin">Administrator</label>
                                </div>

                                <div className="ui radio checkbox">
                                    <input 
                                        type="radio"
                                        tabIndex="0"
                                        className="hidden"
                                        id="artist"

                                        name="artist"
                                        value="artist"
                                        checked={this.state.contributor === 'artist' }
                                        onChange={this.handleChange}
                                        onClick={this.handleClick}
                                    />
                                    <label htmlFor="artist">Artist</label>
                                </div>

                            </div>
                         </div>
                        <span className="error-msg-color">{this.state.errors.contributor}</span>
                    </div>


                    <div className="field">
                        <label htmlFor="websiteAddress">Website link</label>
                        <input
                            value={this.state.websiteAddress || ''}
                            id="websiteAddress"
                            name="websiteAddress"
                            placeholder="Enter website if you have..."
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="facebook">Facebook link</label>
                        <input
                            value={this.state.facebook || ''}
                            id="facebook"
                            name="facebook"
                            placeholder="Enter facebook if you have..."
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="otherLink1">Other links</label>
                        <input
                            value={this.state.otherLink1 || ''}
                            id="otherLink1"
                            name="otherLink1"
                            placeholder="Enter other link if you have any..."
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="field">
                        <input
                            value={this.state.otherLink2 || ''}
                            name="otherLink2"
                            placeholder="Enter other link if you have any..."
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="field">
                        <input
                            value={this.state.otherLink3 || ''}
                            name="otherLink3"
                            placeholder="Enter other link if you have..."
                            onChange={this.handleChange}
                        />
                    </div>


                    <div className="field">
                        <label htmlFor="pleages">Pleages</label>
                        <div className="inline fields">
                            <div className="ten wide field">
                                <input
                                    value={this.state.pleage1 || ''}
                                    id="pleages"
                                    name="pleage1"
                                    placeholder="Enter pleages if you have any..."
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="six wide field">
                                <input
                                    value={this.state.pleage1Percent || ''}
                                    name="pleage1Percent"
                                    placeholder="How many %?"
                                    onChange={this.handleChange}
                                />
                                <label>%</label>
                            </div>
                        </div>
                        
                        <div className="inline fields">
                            <div className="ten wide field">
                                <input
                                    value={this.state.pleage2 || ''}
                                    name="pleage2"
                                    placeholder="Enter pleages if you have any..."
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="six wide field">
                                <input
                                    value={this.state.pleage2Percent || ''}
                                    name="pleage2Percent"
                                    placeholder="How many %?"
                                    onChange={this.handleChange}
                                />
                                <label>%</label>
                            </div>
                        </div>
                    </div>

                    {!!this.state.errors.notes && <div className="ui negative message"><p>{this.state.errors.notes}</p></div>}

                    <div className="field">
                        <label htmlFor="notes">Notes *</label>
                        <textarea
                            rows="4"
                            id="notes"
                            name="notes"
                            value={this.state.notes || ''}
                            placeholder="Please introduce yourself"
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className="field">
                        <button className="ui primary button">Save</button>
                    </div>

                </div>                
            </form>
        );

        return(
            <div>
                {this.state.done ? <Redirect to="/users/existingUser" /> : form }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    // The user id should be the same as the one admin provided
    if(props.paramsMatch) {
        // debugger
        return {
            // user: state.users.find(item => item._id === props.paramsMatch._id)
            user: state.users.find(item => item._id === props.paramsMatch)
        }
    }

    //Otherwise
    return { user: null };
}

export default connect(mapStateToProps, actions)(UsersForm);