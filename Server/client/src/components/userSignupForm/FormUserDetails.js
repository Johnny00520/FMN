import React, { Component } from 'react';
import './common.css';

class FormUserDetails extends Component{
    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    }

    render() {
        const { values, handleChange, onFileChange } = this.props;

        return (
            <div className="form">
                <div className="form-container">
                    <div className="form-user-details">
                        <div className="form-user-details-container">

                            <div className="ui raised segment">
                                <span className="ui blue ribbon label">Enter Details Information</span>
                                <span>All * fields need to be filled</span>
                            </div>

                            <form className="ui form">
                                <div className="two fields">
                                    <div className="field">
                                        <label htmlFor="firstname">First name *</label>
                                        <input
                                            name="firstname"
                                            id="firstname"
                                            placeholder="First Name..."
                                            onChange={handleChange('firstname')}
                                            defaultValue={values.firstname}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="lastname">Last name *</label>
                                        <input
                                            name="lastname"
                                            id="lastname"
                                            placeholder="Last Name..."
                                            onChange={handleChange('lastname')}
                                            defaultValue={values.lastname}
                                        />
                                    </div>
                                </div> 

                                <div className="two fields">

                                    <div className="field">
                                        <label htmlFor="email">Email Address *</label>
                                        <input 
                                            id="email"
                                            name="email"
                                            placeholder="Email address..."
                                            onChange={handleChange('email')}
                                            defaultValue={values.email}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="phoneNum">Phone number *</label>
                                        <input 
                                            id="phoneNum"
                                        name="phoneNum"
                                            type="text"
                                            maxLength="12"
                                            placeholder="###-###-####"
                                            onChange={handleChange('phoneNum')}
                                            // defaultValue={values.phoneNum}
                                            value={values.phoneNum}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                        <label 
                                            htmlFor="file" 
                                            style={{ fontSize: '15px' }}
                                        >Profolio picture: (Only support .jpg .jpeg .png)
                                        </label>
                                        <input 
                                            type="file"
                                            encType="multipart/form-data"
                                            id="file"
                                            name="image"
                                            accept="image/*"
                                            onChange={onFileChange}
                                        />
                                    </div>
                                <br/>

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
                                                checked={values.contributorSelection === 'artist' }
                                                onChange={handleChange('contributorSelection')}
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
                                                checked={values.contributorSelection === 'admin' }
                                                onChange={handleChange('contributorSelection')}
                                            />
                                            <label htmlFor="admin">Administrator</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="websiteAddress">Website link</label>
                                    <input
                                        id="websiteAddress"
                                        name="websiteAddress"
                                        placeholder="Enter website if you have..."
                                        onChange={handleChange('websiteAddress')}
                                        defaultValue={values.websiteAddress}
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="facebook">Facebook link</label>
                                    <input
                                        id="facebook"
                                        name="facebook"
                                        placeholder="Enter facebook if you have..."
                                        onChange={handleChange('facebook')}
                                        defaultValue={values.facebook}
                                    />
                                </div>


                                <div className="button-continue">
                                    <button className="ui right labeled icon button" onClick={this.saveAndContinue}>
                                        <i className="right arrow icon"></i>
                                        Save And Continue
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FormUserDetails;