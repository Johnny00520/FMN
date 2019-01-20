
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions/passwordIndex';
import { connect } from 'react-redux';
import { Button, Form, Alert } from 'react-bootstrap';

import './PasswdForgot.css';

const renderField = ({ input, label, type, placeholder, value, meta: { touched, error, warning }, ...rest }) => (
    <div>
        <label>{label}</label>
        <div>
            <input {...input} placeholder={placeholder} type={type} value={value} className="field-area" {...rest} />
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
    </div>
)

class ForgotPW extends Component {
    render() {
        const { submitting, history } = this.props
        const successfulMsg = "Sucessful, please go check your email";
        const userNotFound = "Mail not found, user does not exist";

        return (            
            <Form style={{ height: '100%'}}>
                <div className="password-forgot-form-container">

                    <div className="password-forgot-form">   

                        <div className="password-forgot-content">

                            <Field 
                                name="email" 
                                type="email" 
                                component={renderField} 
                                label="Email"
                                validate={[required, email]}
                                // validate={[required]}
                            />

                            <Field
                                name="secret_code"
                                type="password"
                                placeholder="If you are not administrator, leave it blank"
                                component={renderField}
                                label="Secret code (Please leave it blank if you are not administrator)"
                            />

                            {this.props.returnMsg.message === successfulMsg ?
                                this.props.returnMsg.message &&
                                <Alert bsStyle="success">
                                    {this.props.returnMsg.message}
                                </Alert> : ''
                            }

                            {this.props.returnMsg.message === userNotFound ?
                                this.props.returnMsg.message &&
                                <Alert bsStyle="danger">
                                    {this.props.returnMsg.message}
                                </Alert> : ''
                            }
                        
                            <div className="forgot-btn">
                                <Button 
                                    type="submit" 
                                    onClick={(e) => {
                                        e.preventDefault()
                                        // sleep(1000)
                                        this.props.passwdSubmit(this.props.formValues, history)
                                    }}
                                    style={{ color: 'grey' }}
                                    disabled={submitting}
                                    color="primary"
                                >Submit
                                </Button>
                            </div>
                        </div>


                    </div>
                </div>


            </Form>
        )
    }
}


const required = value => value ? undefined : <p className="error-message">This is required!</p>
const email = value =>
    value && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(value) ?
    <p className="error-message">Invalid email address</p> : undefined

const mapStateToProps = (state) => {
    // console.log("ForgotPW Form: ", state.form.ForgotPW);
    // console.log("FORGOT_PASSWORD : ", state.auth.error)
    // console.log("User token: ", state.auth);
    // debugger
    return {
        returnMsg: state.auth.error,
        formValues: state.form.ForgotPW
    };
};

export default reduxForm({
    form: 'ForgotPW',  // a unique identifier for this form
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    destroyOnUnmount: false
})(connect(mapStateToProps, actions)(ForgotPW))
