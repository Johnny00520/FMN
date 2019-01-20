// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { Field, reduxForm } from 'redux-form';
// import { Link } from 'react-router-dom';
// import { Button, Form } from 'react-bootstrap';
// import * as actions from '../../../../actions/usersListCRUD';
// import './common.css';

// const renderField = ({ input, label, type, placeholder, value, meta: { touched, error, warning }, ...rest }) => (
//     <div>
//         <label>{label}</label>
//         <div>
//             <input {...input} placeholder={placeholder} type={type} value={value} className="field-area" {...rest} />
//             {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
//         </div>
//     </div>
// )

// class UsersAddNewForm extends Component {

//     render() {
//         const {pristine, submitting } = this.props

//         return(
//             <Form>
//                 <div className="usersAddNewForm-container">
//                     <Field 
//                         name="firstname" 
//                         component={renderField} 
//                         type="text" 
//                         placeholder="Enter your first Name" 
//                         label="First Name" 
//                         // validate={[required, minLength2]} 
//                         // warn={alphaNumeric}
//                     />
//                     <Field 
//                         name="lastname" 
//                         component={renderField} 
//                         type="text" 
//                         placeholder="Enter your last Name" 
//                         label="Last Name" 
//                         // validate={[required, minLength2]}
//                         // warn={alphaNumeric} 
//                     /> 
//                     <Field 
//                         name="email" 
//                         type="email" 
//                         component={renderField} 
//                         label="Email"
//                         // validate={[required, email, aol]}
//                         // validate={[required]}
//                     />
//                     <Field 
//                         name="password" 
//                         component={renderField} 
//                         type="password" 
//                         placeholder="Enter your password" 
//                         label="Password" 
//                         // validate={[required, passwordConstrain, passwordsMatch]} 
//                         // validate={[required]} 
//                     />
//                     <Field 
//                         name="passwordConfirm" 
//                         component={renderField} 
//                         type="password" 
//                         placeholder="Enter your password" 
//                         label="Password Confirm" 
//                         validate={[required, passwordsMatch]} 
//                         // validate={[required]} 
//                     />
//                     <label>Contributor</label>
//                     <div>
//                         <label><Field name="status" component="input" type="radio" value="Artist" validate={[required]} /> Artist</label>
//                         {/* <label><Field name="status" component="input" type="radio" value="Photographer" validate={[required]} style={{ marginLeft: '30px' }} /> Photographer</label> */}
//                         <label><Field name="status" component="input" type="radio" value="superuser" validate={[required]} style={{ marginLeft: '30px' }} /> Administrator</label>
//                     </div>


//                     <Button 
//                         type="submit" 
//                         onClick={(e) => {
//                             e.preventDefault()
//                             // this.props.userSubmitSignup(this.props.formValues, history)
//                             this.props.newUserSave(this.props.formValues)
//                         }}
//                         disabled={pristine || submitting }
//                         color="primary"
//                     >
//                         Save
//                     </Button>
//                 </div>
//             </Form>
//         );
//     }
// }

// const required = value => value ? undefined : <p className="error-message">This is required!</p>
// const passwordsMatch = (value, allValues) => 
//     value !== allValues.password ? <p className="error-message">"Passwords don't match"</p> : undefined;


// const mapStateToProps = (state) => {
//     console.log("UsersAddNewForm Form: ", state.form.UsersAddNewForm);
//     // console.log("User token: ", state.auth);
//     // debugger
//     return {
//         // emptyInput: state.
//         formValues: state.form.UsersAddNewForm
//     };
// };


// export default reduxForm({
//     form: 'UsersAddNewForm',  // a unique identifier for this form
//     enableReinitialize: true,
//     keepDirtyOnReinitialize: true,
//     destroyOnUnmount: false
// })(connect(mapStateToProps, actions)(UsersAddNewForm))