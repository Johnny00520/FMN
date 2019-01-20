import React, { Component } from 'react';
import FormUserDetails from './FormUserDetails';
import MoreUserDetails from './MoreUserDetails';
import ConfirmPage from './ConfirmPage';
import SuccessPage from './SuccessPage';
import { userSignUpSubmit } from '../../actions/userSignup';
import { connect } from 'react-redux';

class UserSignupForm extends Component {
    state = {
        step: 1,
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
        loading: false,  
        selectedFile: '',
        phoneNum: '',
        // phoneNum: []  
    }
    

    nextStep = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1
        });
    }
    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1
        });
    }

    renderRecaptcha = value => {
        this.setState({ recaptcha: value })
    }
    
    handleChange = input => e => {
        // const regex = /^\d+(-\d+)*$/
        // let str = '';
        // let npa = '';
        // let last4 = '';

        // if(input === 'phoneNum') {
        //     if (regex.test(e.target.value)) {
        //         console.log("here in phoneNum: ", e.target.value)
        //         str = e.target.value;

        //         if(str.length === 3) {
        //             // npa = str.slice(0, 3) + "-" + str.slice(5, 8);
        //             npa = str.substring(0, 3) + "-" + str.substring(5, 8);
        //             this.setState({ phoneNum: npa })

        //         } else if(str.length === 7) {
        //             last4 = str +"-"+ str.slice(9, str.length);
        //             // last4 = str +"-"+ str.substring(9);
        //             this.setState({ phoneNum: npa + last4})
        //         } 
        //         else {
        //             this.setState({ phoneNum: str })
        //         }
        //     }
        // } else {
        //     this.setState({ [input] : e.target.value });
        // }

        this.setState({ [input] : e.target.value });
    }

    onFileChange = (e) => {
        this.setState({
            selectedFile: e.target.files[0]
        })
    }

    render () {
        const { step } = this.state;

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
            pleage2Percent,
            selectedFile,
            phoneNum
        } = this.state;

        const values = { 
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
            pleage2Percent,
            selectedFile,
            phoneNum
        }
        switch(step) {
            case 1:
                return (
                    <FormUserDetails 
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        onFileChange={this.onFileChange}
                        values={values}
                    />
                )
            case 2:
                return (
                    <MoreUserDetails
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        handleChange={this.handleChange}
                        values={values}
                        renderRecaptcha={this.renderRecaptcha}
                    />
                )

            case 3:
                return (
                    <ConfirmPage 
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        handleChange={this.handleChange}
                        userSignUpSubmit={this.props.userSignUpSubmit}
                        values={values}
                    />
                )
            
            case 4:
                return (
                    <SuccessPage />
                )
            default:
        }
    }
}

export default connect(null, { userSignUpSubmit })(UserSignupForm)
