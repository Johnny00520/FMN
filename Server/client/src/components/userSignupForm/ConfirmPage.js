import React, { Component } from 'react';
import { userSignUpSubmit } from '../../actions/userSignup';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './common.css';

class ConfirmPage extends Component {
    state = {
        done: false,
        loading: false,
        errors: {}
    }

    saveAndContinue = () => {
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    isValidEmailAddress = (emailAddress) => {
        return !! emailAddress.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    isValidPhone = (phone) => {
        return phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    }

    handleSubmit = e => {
        e.preventDefault();

        let errors = {};

        if(this.props.values.file === null) errors.file = 'Picture is required';
        if(this.props.values.selectedFile === null || this.props.values.selectedFile === '') errors.selectedFile = 'Picture is required';
        if(this.props.values.firstname === '') errors.firstname = "First name cannot be empty";
        if(this.props.values.lastname === '') errors.lastname = "Last name cannot be empty";
        // if(this.props.values.phoneNum === '') errors.phoneNum = "Phone number cannot be empty";
        // if(this.props.values.phoneNum.length !== 12) errors.phoneNum = "Phone number format incorrectly";
        if(this.props.values.email === '') errors.email = "Email address cannot be empty";
        if(this.props.values.notes === '') errors.notes = "Notes cannot be empty";
        if(this.props.values.contributorSelection === '') errors.contributorSelection = "Contributor cannot be empty";
        if(this.props.values.recaptcha === undefined || this.props.values.recaptcha === '' || this.props.values.recaptcha === null ) errors.recaptcha = "Recaptcha connot be empty"
        
        let validPhone = this.isValidPhone(this.props.values.phoneNum)
        if(!validPhone) errors.phoneNum = "Phone format incorrectly. Did you include dash?";
        let validEmail = this.isValidEmailAddress(this.props.values.email);
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
                file,
                otherLink1, 
                otherLink2, 
                otherLink3,
                facebook,
                pleage1,
                pleage1Percent,
                pleage2,
                pleage2Percent,
                selectedFile,
                phoneNum
            } = this.props.values;

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
                file,
                pleage1,
                pleage1Percent,
                pleage2,
                pleage2Percent,
                selectedFile,
                phoneNum
                })
                .then(() => {
                    this.setState({
                        done: true
                    })
                },
                (err) => {
                    console.log("err: ", err)
                    err.response.json().then(({ errors }) => this.setState({ errors, loading: false }))
                }
            )
        } 
    }

    render() {
        const { values: {
            firstname, 
            lastname, 
            email, 
            contributorSelection, 
            notes, 
            websiteAddress,
            file,
            otherLink1, 
            otherLink2, 
            otherLink3,
            facebook,
            pleage1,
            pleage1Percent,
            pleage2,
            pleage2Percent,
            phoneNum
        } } = this.props;

        const form = (
            <form className={classNames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
                <div className="form-container">
                    <div className="form-user-details">
                        <div className="form-user-details-container">
                            <div className="ui raised segment">
                                <span className="ui blue ribbon label">Confirm Details Information</span>
                            </div>

                            {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}
                            {!!this.state.errors.firstname && <div className="ui negative message"><p>{this.state.errors.firstname}</p></div>}
                            {!!this.state.errors.file && <div className="ui negative message"><p>{this.state.errors.file}</p></div>}
                            {!!this.state.errors.selectedFile && <div className="ui negative message"><p>{this.state.errors.selectedFile}</p></div>}
                            {!!this.state.errors.lastname && <div className="ui negative message"><p>{this.state.errors.lastname}</p></div>}
                            {!!this.state.errors.email && <div className="ui negative message"><p>{this.state.errors.email}</p></div>}
                            {!!this.state.errors.contributorSelection && <div className="ui negative message"><p>{this.state.errors.contributorSelection}</p></div>}
                            {!!this.state.errors.notes && <div className="ui negative message"><p>{this.state.errors.notes}</p></div>}
                            {!!this.state.errors.recaptcha && <div className="ui negative message"><p>{this.state.errors.recaptcha}</p></div>}
                            {!!this.state.errors.phoneNum && <div className="ui negative message"><p>{this.state.errors.phoneNum}</p></div>}

                            <div className="ui relaxed divided list">
                                <div className="item">
                                    <i className="users icon"></i>
                                    <div className="content" style={{ height: '10px'}}>{firstname} {lastname}</div>
                                </div>

                                <div className="item">
                                    <i className="mail icon"></i>
                                    <div className="content">{email}</div>
                                </div>

                                <div className="item">
                                    <i className="phone icon"></i>
                                    <div className="content">{phoneNum}</div>
                                </div>

                                <div className="item">
                                    <i className="staylinked icon"></i>
                                    <div className="content">{websiteAddress === '' ? 'N/A' : websiteAddress}</div>
                                </div>

                                <div className="item">
                                    <i className="child icon"></i>
                                    <div className="content">{contributorSelection}</div>
                                </div>

                                <div className="item">
                                    <i className="wrench icon"></i>
                                    <div className="content">
                                        {pleage1 === '' ? 'N/A' : pleage1} {pleage1Percent === '' ? 'N/A' : pleage1Percent}% <br/>
                                        {pleage2 === '' ? 'N/A' : pleage2} {pleage2Percent === '' ? 'N/A' : pleage2Percent}% <br/>
                                    </div>
                                </div>

                                <div className="item">
                                    <i className="linkify icon"></i>
                                    <div className="content">
                                        {otherLink1 === '' ? 'N/A' : otherLink1} <br/>
                                        {otherLink2 === '' ? 'N/A' : otherLink2} <br/>
                                        {otherLink3 === '' ? 'N/A' : otherLink3} <br/>
                                    </div>
                                </div>

                                <div className="item">
                                    <i className="file icon"></i>
                                    <div className="content">
                                        {file}
                                    </div>
                                </div>

                                <div className="item">
                                    <i className="facebook icon"></i>
                                    <div className="content">
                                        {facebook === '' ? 'N/A' : facebook}
                                    </div>
                                </div>

                                <div className="item">
                                    <i className="sticky note outline icon"></i>
                                    <div className="content">
                                        {notes}
                                    </div>
                                </div>
                            </div>

                            <div className="confirm-buttons">
                                <div className="button-continue">
                                    <button className="ui right labeled icon button" onClick={this.back}>
                                        <i className="left arrow icon"></i>
                                        Back
                                    </button>
                                </div>
                                <div className="button-continue">
                                    <button className="ui right labeled icon button" >
                                        <i className="right arrow icon"></i>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )

        return (
            <div className="height-controller" style={{ height: '90vh' }}>
                <div className="confirm-page" style={{ height: '100%' }}>
                    {this.state.done ? this.saveAndContinue() : form}   
                </div>
            </div>
        )
    }
}

export default connect(null, { userSignUpSubmit })(ConfirmPage)
