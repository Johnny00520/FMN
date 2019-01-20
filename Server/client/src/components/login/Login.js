
// import React, { Component } from 'react'
// import { Field, reduxForm } from 'redux-form';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { Button } from 'react-bootstrap';
// import * as actions from '../../actions/passwordIndex';
// import './Login.css';

// const renderField = ({ input, label, type, placeholder, value, meta: { touched, error, warning }, ...rest }) => (
//     <div>
//         <label>{label}</label>
//         <div>
//             <input {...input} placeholder={placeholder} type={type} value={value} className="field-area" {...rest} />
//             {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
//         </div>
//     </div>
// )

// class UserLoginForm extends Component {

//     render() {

//         const { error, submitting, history } = this.props;

//         return (
//             <div style={{ height: '93vh'}} >
//                 <div className="UserLogin-page">
//                     <div className="userLogin-content">
//                         <div className="userLogin-leftContent">
//                             <div className="userLogin-member-checker">
//                                 Are you an artist who wants to make an impact?

//                                 <Button bsStyle="success">
//                                     <Link to="/signup" >
//                                         Get involved
//                                     </Link>
//                                 </Button>
//                             </div>
//                         </div>

//                         <div className="userLogin-rightContent">

//                             <div className="rightContent-container">

//                                 <form>
//                                     <div className="UserLoginForm">

//                                         <Field 
//                                             name="email" 
//                                             type="email" 
//                                             component={renderField} 
//                                             label="Email"
//                                             validate={[required, email, aol]}
//                                         />

//                                         <Field 
//                                             name="password" 
//                                             type="password" 
//                                             component={renderField} 
//                                             label="Password"
//                                             validate={[required]}
//                                         />

//                                         {this.props.errorMsg && 
//                                         <p className="error-message">
//                                             {this.props.errorMsg.error.message}
//                                         </p>}

//                                         {error && <strong style={{ color: 'red' }}>{error}</strong>}
//                                         <Link to="/user/passwd-forgot">
//                                         Forgot password
//                                         </Link>
//                                         <div className="btnForm">

//                                             <Button>
//                                                 <Link to="/"> Cancel </Link>
//                                             </Button>
//                                             <Button 
//                                                 type="submit" 
//                                                 onClick={(e) => {
//                                                     e.preventDefault()
//                                                     // sleep(1000)
//                                                     this.props.userSubmitSignin(this.props.formValues, history)
//                                                 }}
//                                                 style={{ color: 'grey' }}
//                                                 disabled={submitting}
//                                                 color="primary"
//                                             >Log in
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }


// const required = value => value ? undefined : <p className="error-message">This is required!</p>
// const email = value =>
//     value && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     .test(value) ?
//     <p className="error-message">Invalid email address</p> : undefined
// const aol = value =>
//     value && /.+@aol\.com/.test(value) ?
//     <p className="error-message">Really? You still use AOL for your email?</p> : undefined


// const mapStateToProps = (state) => {
//     console.log("state: ", state)
//     // debugger
//     return {
//         // incorrectPassword: state.auth,
//         errorMsg: state.auth,
//         formValues: state.form.UserLoginForm
//     };
// };

// export default reduxForm({
//     form: 'UserLoginForm',  // a unique identifier for this form
//     enableReinitialize: true,
//     keepDirtyOnReinitialize: true,
//     destroyOnUnmount: false
// })(connect(mapStateToProps, actions)(UserLoginForm))
