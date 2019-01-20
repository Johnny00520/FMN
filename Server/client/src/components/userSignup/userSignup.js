import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userSignUpSubmit } from '../../actions/userSignup';
import ReCAPTCHA from "react-google-recaptcha";
import { Redirect } from 'react-router';
import './userSignup.css';

class userSignup extends Component {
    
    state = {
        firstname: '',
        lastname: '',
        email: '',
        websiteAddress: '',
        facebook: '',
        notes: '',
        otherLink1: '',
        otherLink2: '',
        otherLink3: '',
        contributorSelection: null,
        recaptcha: '',
        pleage1: '',
        pleage1Percent: '',
        pleage2: '',
        pleage2Percent: '',
        errors: {},
        loading: false,        
    }

    renderRecaptcha = value => {
        this.setState({ recaptcha: value })
    }

    handleChange = (e) => {
        if(!!this.state.errors[e.target.name]) {

            let errors = Object.assign({}, this.state.errors);
            delete errors[e.target.name];

            this.setState({ 
                [e.target.name]: e.target.value,
                errors
            }, () => {
                this.setState(() => ({
                    contributorSelection: e.target.value
                }))
            });
            // console.log("e.target.value: " , e.target.value)
            if(e.target.type === 'radio'){
                this.setState({ contributorSelection: e.target.value });
            }
            
        } else {
            this.setState({ [e.target.name]: e.target.value })
            if(e.target.type === 'radio'){
                this.setState({ contributorSelection: e.target.value });
                // console.log("e.target.value: " , e.target.value)
            }
        }
    }

    handleClick = () => {
        this.setState({ contributorSelection: '' });
    }

    isValidEmailAddress = (emailAddress) => {
        return !! emailAddress.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};
    
        if(this.state.firstname === '') errors.firstname = "First name cannot be empty";
        if(this.state.lastname === '') errors.lastname = "Last name cannot be empty";
        if(this.state.email === '') errors.email = "Email address cannot be empty";
        if(this.state.notes === '') errors.notes = "Notes cannot be empty";
        if(this.state.contributorSelection === '') errors.contributorSelection = "Contributor cannot be empty";
        if(this.state.recaptcha === undefined || this.state.recaptcha === '' || this.state.recaptcha === null ) errors.recaptcha = "Recaptcha connot be empty"
    
        let validEmail = this.isValidEmailAddress(this.state.email);
        if(!validEmail) errors.email = "Email format is not valid";

        this.setState({ errors });

        const isValid = Object.keys(errors).length === 0;
    
        if(isValid) {
            const { 
                firstname, 
                lastname, 
                email, 
                contributorSelection, 
                notes, 
                recaptcha, 
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
    
            this.props.userSignUpSubmit({ 
                firstname, 
                lastname, 
                email, 
                contributorSelection, 
                notes, 
                recaptcha, 
                websiteAddress, 
                otherLink1, 
                otherLink2, 
                otherLink3,
                facebook,
                pleage1,
                pleage1Percent,
                pleage2,
                pleage2Percent }).then(
                ()=> { 
                    this.setState({ done: true });
                    window.open('/api/signup/thanks_confirmation');
                },
                (err) => {
                    console.log("err: ", err)
                    // debugger
                    err.response.json().then(({ errors }) => this.setState({ errors, loading: false }))
                }
            );
        }
    }

    render() {
        const form = (
            <div className="signup-background">
                <div className="fields-container">
                    <form className={classNames('ui', 'form')} onSubmit={this.handleSubmit}>
                        
                            <h2 className="ui dividing header">This Page is intended for Artists and Administrator. All * fields need to be filled</h2>

                            {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}
                            {!!this.state.errors.firstname && <div className="ui negative message"><p>{this.state.errors.firstname}</p></div>}
                            {!!this.state.errors.lastname && <div className="ui negative message"><p>{this.state.errors.lastname}</p></div>}

                            <div className="two fields">
                                <div className="field">
                                    <label htmlFor="firstname">First name *</label>
                                    <input
                                        name="firstname"
                                        id="firstname"
                                        value={this.state.firstname}
                                        placeholder="First Name..."
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="lastname">Last name *</label>
                                    <input
                                        name="lastname"
                                        value={this.state.lastname}
                                        id="lastname"
                                        placeholder="Last Name..."
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>                    

                            {!!this.state.errors.email && <div className="ui negative message"><p>{this.state.errors.email}</p></div>}

                            <div className="field">
                                <label htmlFor="email">Email Address *</label>
                                <input 
                                    value={this.state.email}
                                    id="email"
                                    name="email"
                                    placeholder="Email address..."
                                    onChange={this.handleChange}
                                />
                            </div>

                            {!!this.state.errors.contributorSelection && <div className="ui negative message"><p>{this.state.errors.contributorSelection}</p></div>}

                            <div className="inline fields">
                                <label>Contributor *</label>
                                <div className="field">
                                    <div className="ui radio checkbox">
                                        <input 
                                            type="radio"
                                            tabIndex="0"
                                            className="hidden"
                                            id="artist"

                                            name="artist"
                                            value="artist"
                                            checked={this.state.contributorSelection === 'artist' }
                                            onChange={this.handleChange}
                                            onClick={this.handleClick}
                                        />
                                        <label htmlFor="artist">Artist</label>
                                    </div>
                                </div>

                                <div className="field">
                                    <div className="ui radio checkbox">
                                        <input 
                                            type="radio"
                                            tabIndex="0"
                                            className="hidden"
                                            id="admin"

                                            name="admin"
                                            value="admin"
                                            checked={this.state.contributorSelection === 'admin' }
                                            onChange={this.handleChange}
                                            onClick={this.handleClick}
                                        />
                                        <label htmlFor="admin">Administrator</label>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label htmlFor="websiteAddress">Website link</label>
                                <input
                                    value={this.state.websiteAddress}
                                    id="websiteAddress"
                                    name="websiteAddress"
                                    placeholder="Enter website if you have..."
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="facebook">Facebook link</label>
                                <input
                                    value={this.state.facebook}
                                    id="facebook"
                                    name="facebook"
                                    placeholder="Enter facebook if you have..."
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="otherLink1">Other links</label>
                                <input
                                    value={this.state.otherLink1}
                                    id="otherLink1"
                                    name="otherLink1"
                                    placeholder="Enter other link if you have any..."
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="field">
                                <input
                                    value={this.state.otherLink2}
                                    name="otherLink2"
                                    placeholder="Enter other link if you have any..."
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="field">
                                <input
                                    value={this.state.otherLink3}
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
                                            value={this.state.pleage1}
                                            id="pleages"
                                            name="pleage1"
                                            placeholder="Enter pleages if you have any..."
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="six wide field">
                                        <input
                                            value={this.state.pleage1Percent}
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
                                            value={this.state.pleage2}
                                            name="pleage2"
                                            placeholder="Enter pleages if you have any..."
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="six wide field">
                                        <input
                                            value={this.state.pleage2Percent}
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
                                    value={this.state.notes}
                                    placeholder="Please introduce yourself"
                                    onChange={this.handleChange}
                                />
                            </div>

                            {!!this.state.errors.recaptcha && <div className="ui negative message"><p>{this.state.errors.recaptcha}</p></div>}

                            <div className="field">
                                <ReCAPTCHA
                                    style={{ display: "inline-block" }}
                                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                    name="recaptcha" 
                                    onChange={this.renderRecaptcha}
                                />
                            </div>

                        <div className="field" style={{ display: 'flex', flexDirection: 'row-reverse'}} >
                            <button className="ui primary button">Submit</button>
                            <Link to="/">
                                <button className="ui primary button">Cancel</button>
                            </Link>
                            
                        </div>

                    </form>
                </div>
            </div>
        )
        return (
            <div>
                {this.state.done ? <Redirect to="/" /> : form }
            </div>
        );
    }
}

// const mapStateToProps = (state) => {
//     debugger
//     return {
//         passVerification: state.user
//     }
// }

// export default connect(mapStateToProps, { userSignUpSubmit })(userSignup)
export default connect(null, { userSignUpSubmit })(userSignup)
