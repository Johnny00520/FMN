// import React, { Component } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { reduxForm, Field, isPristine } from 'redux-form';

// import { withRouter } from 'react-router';
// import { compose } from 'redux';
// // import googleSignUpImg from '../../assets/images/googleSignup.png';
// import './SignUp.css';
// import { connect } from 'react-redux';
// // import { Link } from 'react-router-dom';
// import * as actions from '../../actions/index';
// import ReCAPTCHA from "react-google-recaptcha";


// // const FIELDS = [
// //     { label: 'First Name', name: 'firstname', type: 'text', placeholder: "Enter First Name",  },
// //     { label: 'Last Name', name: 'lastname', type: 'text', placeholder: "Enter Last Name" },
// //     { label: 'Email', name: 'emailAddr', type: 'email', placeholder: "Enter Email Address" },
// //     { label: 'Password', name: 'password', type: 'text', placeholder: "Enter Password" },
// //     { label: 'Contributor', name: 'contributor', type: 'text', placeholder: "Artist/photographer?", valueChecking: 'Only type Artist, Photographer, or User' },
// //     { label: 'sex', name: 'sex', type: 'radio', value: 'male', 'female'}
// //     // { label: 'Artist', name: 'contributor', type: 'radio', value: 'artist'},
// //     // { label: 'PhotoGrapher', name: 'contributor', type: 'radio', value: 'photographer' }
// //     // { label: 'Artist', name: 'contributor', type: 'radio', options: {title: "test1", value: 'artist'} },
// // ];

// const renderField = ({ input, label, type, placeholder, value, meta: { touched, error, warning }, ...rest }) => (
//     <div>
//         <label>{label}</label>
//         <div>
//             <input {...input} placeholder={placeholder} type={type} value={value} className="field-area" {...rest} />
//             {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}

//         </div>
//     </div>
// )

// class SignUp extends Component {
//     constructor(props, context) {
//         super(props, context);
  
//         this.state = {
//             modalShow: false,
//             redirect: false
//         };

//         this.handleShow = this.handleShow.bind(this);
//         this.handleClose = this.handleClose.bind(this);
//     }
  
//     handleClose() {
//         this.setState({ modalShow: false });
//     }
  
//     handleShow() {
//         this.setState({ modalShow: true });
//     }

//     renderRecaptchaField(field) {
//         const { meta: { touched, error } } = field;

//         return (
//             <div className="recaptcha">   
//                 <ReCAPTCHA 
//                     style={{ display: "inline-block" }}

//                     sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
//                     onChange={field.input.onChange}
//                     // size="invisible"
//                 />
//                 <div><p className="text-danger">{ touched ? error : '' }</p></div>
//           </div>
//         );
//     }

//     render() {

//         const { pristine, submitting, history } = this.props;
//         const passwordUnfit = 'Something wrong';
//         const emailBeenRegistered = 'This email has been registered!!';
//         const selectRecapcha = 'Select Recaptcha!';
//         // const statusRequired = 'status is required';

//         return (
//             <Form >
//                 <Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>Sign Up</Button>
    
//                 <Modal show={this.state.modalShow} onHide={this.handleClose}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>Welcome to For Mother Nature</Modal.Title>
//                     </Modal.Header>

//                     <Modal.Body>
//                         <p className="signup-subtitle">This is intent to Artist or photographer</p>
//                         <p>All * filed needs to be filled</p>
//                         <div>
//                             <Field 
//                                 name="firstname" 
//                                 component={renderField} 
//                                 type="text" 
//                                 placeholder="Enter your first Name" 
//                                 label="First Name *" 
//                                 validate={[required, minLength2]} 
//                                 warn={alphaNumeric} 
//                             />
//                             <Field 
//                                 name="lastname" 
//                                 component={renderField} 
//                                 type="text" 
//                                 placeholder="Enter your last Name" 
//                                 label="Last Name *" 
//                                 validate={[required, minLength2]}
//                                 warn={alphaNumeric} 
//                             />   
//                             <Field 
//                                 name="email" 
//                                 component={renderField} 
//                                 type="email" 
//                                 placeholder="Enter your email address" 
//                                 label="Email *" 
//                                 validate={[required, email, aol]} 
//                             />

//                             {this.props.emailBeenRegistered.error === emailBeenRegistered ?
//                             this.props.emailBeenRegistered.error 
//                                 && <p className="error-message">
//                                 {this.props.emailBeenRegistered.error}
//                                 </p> : ''}
                            
//                             <Field 
//                                 name="website"
//                                 component={renderField}
//                                 type="input"
//                                 placeholder="Enter your website"
//                                 label="Enter your personal website if you have any"
//                             />
//                             <Field 
//                                 name="password" 
//                                 component={renderField} 
//                                 type="password" 
//                                 placeholder="Enter your password" 
//                                 label="Password *" 
//                                 validate={[required, passwordConstrain, passwordsMatch]} 
//                                 // validate={[required]} 
//                             />
//                             <Field 
//                                 name="passwordConfirm" 
//                                 component={renderField} 
//                                 type="password" 
//                                 placeholder="Enter your password" 
//                                 label="Password Confirm *" 
//                                 validate={[required, passwordsMatch]} 
//                                 // validate={[required]} 
//                             />

                            
                            
//                             <label>Contributor</label>
//                             <div>
//                                 <label><Field name="status" component="input" type="radio" value="Artist" validate={[required]} /> Artist</label>
//                                 {/* <label><Field name="status" component="input" type="radio" value="Photographer" validate={[required]} style={{ marginLeft: '30px' }} /> Photographer</label> */}
//                                 <label><Field name="status" component="input" type="radio" value="superuser" validate={[required]} style={{ marginLeft: '30px' }} /> Administrator</label>
//                             </div>

//                             {/* {this.props.errorMsg.error[0] === statusRequired ?
//                                 this.props.errorMsg.error[0] && <p className="error-message">
//                                     {this.props.errorMsg.error[0]}
//                                 </p> : ''
//                             } */}

//                             {this.props.passwordUnfit.error === passwordUnfit ?
//                                 this.props.passwordUnfit.error && <p className="error-message">
//                                 {this.props.passwordUnfit.error}
//                             </p> : ''}

//                             <Field 
//                                 name="adminForCode" 
//                                 component={renderField} 
//                                 type="text" 
//                                 placeholder="If you not an administrator, leave it blank" 
//                                 label="AdminCode" 
//                             />

//                             <div>
//                                 <label>Notes</label>
//                                 <div>
//                                     <Field name="notes" component="textarea" placeholder="Introduce yourself" validate={[required]} style={{ width: '100%', height: '100px' }} />
//                                 </div>
//                             </div>

//                             <Field 
//                                 name="recaptcha" 
//                                 component={this.renderRecaptchaField} 
//                             />

//                             {this.props.recaptchaFailed.error === selectRecapcha ?
//                             this.props.recaptchaFailed.error
//                                 && <p className="error-message">
//                                 {this.props.recaptchaFailed.error}
//                                 </p> : '' }
//                         </div>
//                     </Modal.Body>

//                     <Modal.Footer>
//                         <Button onClick={this.handleClose}>Close</Button>
//                         <Button 
//                             type="submit" 
//                             onClick={(e) => {
//                                 e.preventDefault()
//                                 this.props.userSubmitSignup(this.props.formValues, history)
//                             }}
//                             disabled={pristine || submitting }
//                             color="primary"
//                         >
//                             Submit
//                         </Button>
//                     </Modal.Footer>

//                     {/* <Link 
//                         to={this.props.auth.user ? '/about' : '/landing'} 
//                         className="left brand-logo"
//                     >
//                     </Link> */}

//                     {/* <div className="login-image-container">
//                         <Thumbnail href="/auth/google" src={googleSignUpImg} bsClass="login-image" />
//                     </div> */}
//                 </Modal>
//             </Form>
//         );
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

// const alphaNumeric = value =>
//     value && /[^a-zA-Z ]/i.test(value)
//       ? <p className="error-message">Only alphabet characters</p>
//       : undefined

// export const minLength = min => value =>
//     value && value.length < min ?  <p className="error-message">Must be {min} characters or more</p> : undefined
// export const minLength2 = minLength(2)


// const passwordConstrain = value =>
//     value && !/^(?=[A-Z])(?=.*?[0-9])(?=.*?[^\w\s]).+$/.test(value)
//     ?  <p className="error-message">Passwords must at least 8 characters, include one capital letter, one number, and one special character like: +@?=*$.</p>
//     : undefined;

// const passwordsMatch = (value, allValues) => 
//     value !== allValues.password ? <p className="error-message">"Passwords don't match"</p> : undefined;

// function validate(values) {
//     const { recaptcha } = values;
//     const error = {};
    
//     if (!recaptcha) {
//         error.recaptcha = 'reCAPTCHA required.';
//     }
//     return error;
// }

// const mapStateToProps = (state) => {
//     // console.log("state.form: ", state.form)
//     // console.log("state auth in sign up: ", state.auth)
//     return {
//         // errorMsg: state.auth,
//         errorMsg: state.auth,

//         recaptchaFailed: state.auth,
//         emailBeenRegistered: state.auth,
//         passwordUnfit: state.auth,
//         formValues: state.form.signupForm,
//         pristine: isPristine('signupForm')(state)
//     };
// };

// // export default reduxForm({
// //     form: 'signupForm',
// //     enableReinitialize: true,
// //     keepDirtyOnReinitialize: true,
// //     destroyOnUnmount: false
// // })(connect(mapStateToProps, actions )(withRouter(SignUp)));

// export default compose(
//     reduxForm({
//         validate,
//         form: 'signupForm',
//         enableReinitialize: true,
//         keepDirtyOnReinitialize: true,
//         destroyOnUnmount: false
//     }),
//     withRouter,
//     connect(mapStateToProps, actions),
// )(SignUp)