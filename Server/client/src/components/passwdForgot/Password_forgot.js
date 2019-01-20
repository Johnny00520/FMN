import React, { Component } from 'react'
import classnames from 'classnames';
import { connect } from 'react-redux';
import { passwdSubmit } from '../../actions/passwordIndex';
import { Alert } from 'react-bootstrap';
import './PasswdForgot.css';

class Password_forgot extends Component {

    state = {
      email: '',
      secret_code: '',
      emailFormatChecking: '',
      loading: false,
      returnMsg: '',
      errors: {},
      done: ''
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

    emailFormatChecking = (value) => {
      return value && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};
        if(this.state.email === '') errors.email = 'Cannot be empty';
        if(!this.emailFormatChecking(this.state.email)) errors.emailFormatChecking = 'Email format incorrectly';
        this.setState({ errors });
        const isValid = Object.keys(errors).length === 0;

        if(isValid) {
            const { email, secret_code } = this.state;
            this.setState({ loading: true })

            this.props.passwdSubmit({ email, secret_code })
                .then(
                    //success
                    (msg) => { 
                        this.setState({ 
                            done: true,
                            returnMsg: msg.data.message
                        })
                    },
                    //fail
                    (err) => {
                        console.log("err in Password_forgot: ", err);
                        err.response.json().then(({errors}) => this.setState({ errors, loading: false }))
                    }
            );
        }
    }

    render() {
        const form = (

            <div className="password-forgot-form">

              <div className="ui container">
                  <form className={classnames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>

                    {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}
                    
                    <div className={classnames('field', {error: !!this.state.errors.email })}>

                        {!!this.state.returnMsg && <div className="ui negative message"><p>{this.state.returnMsg}</p></div>}

                        <label htmlFor="email">Email *</label>
                        <input
                            name="email"
                            value={this.state.email || ''}
                            onChange={this.handleChange}
                            id="email"
                            placeholder="Enter email..."
                        />
                        <span className="error-msg-color">{this.state.errors.email}</span>
                        <span className="error-msg-color">{this.state.errors.emailFormatChecking}</span>
                    </div>

                    <div className={classnames('field')}>
                        <label htmlFor="secret_code">Secret code(Please leave it blank if you are not administrator</label>
                        <input
                            name="secret_code"
                            value={this.state.secret_code || ''}
                            onChange={this.handleChange}
                            id="secret_code"
                            placeholder="Enter secret_code..."
                        />
                        <span className="error-msg-color">{this.state.errors.secret_code}</span>
                    </div>

                    <div className="forgot-btn">
                      <div className="field">
                          <button className="ui primary button">Save</button>
                      </div>
                    </div>

                  </form>
              </div>
            
            </div>
        )

        return (
            <div className="password-forgot-form-container">
                
                {this.state.done ?
                    <Alert
                        bsStyle="success"
                    >
                        <p>{this.state.returnMsg}</p>
                    </Alert>
                : form}
            </div>
        )
    }
}

export default connect(null, {
  passwdSubmit
})(Password_forgot)
