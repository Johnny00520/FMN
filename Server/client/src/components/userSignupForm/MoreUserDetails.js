import React, { Component } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import './common.css';

class MoreUserDetails extends Component{

    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep()
    }

    render() {
        const { values, handleChange, renderRecaptcha } = this.props;

        return (
            <div className="form">
                <div className="form-container">
                    <div className="form-user-details">
                        <div className="form-user-details-container">
                            <div className="ui raised segment">
                                <span className="ui blue ribbon label">More Details Information</span>
                                <span>All * fields need to be filled</span>
                            </div>

                            <form className="ui form">
                                <div className="field">
                                    <label htmlFor="otherLink1">Other links</label>
                                    <input 
                                        id="otherLink1"
                                        name="otherLink1"
                                        placeholder="Enter additional link if you have..."
                                        onChange={handleChange('otherLink1')}
                                        defaultValue={values.otherLink1}
                                    />
                                </div>

                                <div className="field">
                                    <input 
                                        id="otherLink2"
                                        name="otherLink2"
                                        placeholder="Enter additional link if you have..."
                                        onChange={handleChange('otherLink2')}
                                        defaultValue={values.otherLink2}
                                    />
                                </div>
                                <div className="field">
                                    <input 
                                        id="otherLink3"
                                        name="otherLink3"
                                        placeholder="Enter additional link if you have..."
                                        onChange={handleChange('otherLink3')}
                                        defaultValue={values.otherLink3}
                                    />
                                </div>

                                <label htmlFor="pleages">Pleages</label>
                                <div className="two fields">
                                    <div className="field">
                                        <input
                                            defaultValue={values.pleage1}
                                            id="pleages"
                                            name="pleage1"
                                            placeholder="Enter pleage if you have any..."
                                            onChange={handleChange('pleage1')}
                                        />
                                    </div>
                                    <div className="field">
                                        <input
                                            defaultValue={values.pleage1Percent}
                                            name="pleage1Percent"
                                            placeholder="How many %?"
                                            onChange={handleChange('pleage1Percent')}
                                        />
                                    </div>
                                </div>
                                    
                                <div className="two fields">
                                    <div className="field">
                                        <input
                                            defaultValue={values.pleage2}
                                            name="pleage2"
                                            placeholder="Enter pleage if you have any..."
                                            onChange={handleChange('pleage2')}
                                        />
                                    </div>
                                    <div className="field">
                                        <input
                                            defaultValue={values.pleage2Percent}
                                            name="pleage2Percent"
                                            placeholder="How many %?"
                                            onChange={handleChange('pleage2Percent')}
                                        />
                                    </div>
                                </div>


                                <div className="field">
                                    <label htmlFor="notes">Notes *</label>
                                    <textarea
                                        rows="4"
                                        id="notes"
                                        name="notes"
                                        defaultValue={values.notes}
                                        placeholder="Please introduce yourself"
                                        onChange={handleChange('notes')}
                                    />
                                </div>

                                <div className="recaptcha-container">
                                    <div className="field">
                                        <ReCAPTCHA
                                            style={{ display: "inline-block" }}
                                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                            name="recaptcha" 
                                            onChange={renderRecaptcha}
                                            defaultValue={values.recaptcha}
                                        />
                                    </div>
                                </div>
                                
                                <br/>
                                <div className="back-continue-buttons">

                                    <div className="inline fields">
                                        <div className="button-continue">
                                            <button className="ui right labeled icon button" onClick={this.back}>
                                                <i className="left arrow icon"></i>
                                                Back
                                            </button>
                                        </div>
                                        <div className="button-continue">
                                            <button className="ui right labeled icon button" onClick={this.saveAndContinue}>
                                                <i className="right arrow icon"></i>
                                                Save And Continue
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MoreUserDetails;