import React, { Component } from 'react';
import { Redirect } from 'react-router';
import classNames from 'classnames';
import './FirstTimeLogin.css';
import { connect } from 'react-redux';
import { firstLogin } from '../../actions/passwordIndex';

class FirstTimeLogin extends Component {
    state = {
        password: '',
        passwordConfirm: '',
        passwordRequirement: '',
        errors: {},
        mismatch: '',
        token: this.props.match.params.token ? this.props.match.params.token : '',
        loading: false,
        done: false
    }

    handleChange = (e) => {
        if(!!this.state.errors[e.target.name]) {
            let errors = Object.assign({}, this.state.errors);
            delete errors[e.target.name]

            this.setState({
                [e.target.name]: e.target.value,
                errors
            })
        } else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    passwordChecking = (value) => {
        return value && /^(?=[A-Z])(?=.*?[0-9])(?=.*?[^\w\s]).+$/.test(value)   
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let errors = {};

        if(this.state.password === '')  errors.password = 'Connot be empty';
        if(this.state.passwordConfirm === '')  errors.passwordConfirm = 'Connot be empty';
        if(!this.passwordChecking(this.state.password)) errors.passwordRequirement = 'Passwords must at least 8 characters, include one capital letter, one number, and one special character like: +@?=*$.';
        if(this.state.password !== this.state.passwordConfirm) errors.mismatch = 'Password mismatch';

        this.setState({ errors });
        const isValid = Object.keys(errors).length === 0;

        if(isValid) {

            const { password, passwordConfirm, token } = this.state;
            this.setState({ loading: true })

            this.props.firstLogin({
                password,
                passwordConfirm,
                token
            })
            .then(
                //success
                () => { this.setState({ done: true }) },
                //fail
                (err) => {
                    console.log("err in FirstTimeLogin: ", err);
                    err.response.json().then(({errors}) => this.setState({ errors, loading: false }))
                }
            );
        }
    }

    render() {

        const form = (
            <form className={classNames('ui', 'form', {loading: this.state.loading})} onSubmit={this.handleSubmit}>
                <div className="fields-container">

                    <div className={classNames('field', {error: !!this.state.errors.password })}>
                        <label htmlFor="password">Password *</label>
                        <input
                            name="password"
                            type="password"
                            value={this.state.password || ''}
                            onChange={this.handleChange}
                            id="password"
                            placeholder="Enter your password..."
                        />
                        <span className="error-msg-color">{this.state.errors.password}</span>
                    </div>

                    <div className={classNames('field', {error: !!this.state.errors.passwordConfirm })}>
                        <label htmlFor="passwordConfirm">Password Confirm *</label>
                        <input
                            name="passwordConfirm"
                            value={this.state.passwordConfirm || ''}
                            onChange={this.handleChange}
                            id="passwordConfirm"
                            type="password"
                            placeholder="Enter your password again..."
                        />
                        <span className="error-msg-color">{this.state.errors.passwordConfirm}</span>
                    </div>
                    <span className="error-msg-color">{this.state.errors.mismatch}</span>
                    <span className="error-msg-color">{this.state.errors.passwordRequirement}</span>

                    <div className="btn">
                        <div className="field">
                            <button className="ui primary button">Submit</button>
                        </div>
                    </div>

                </div>
            </form>
        )
        return (
            <div className="first-time-login">
                <div className="ui container">
                    {this.state.done ? <Redirect to="/" /> : form}
                </div>
            </div>
        )
    }
}

export default connect(null, { firstLogin })(FirstTimeLogin);
