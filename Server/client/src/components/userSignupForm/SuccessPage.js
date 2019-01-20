import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './common.css';

class SuccessPage extends Component {

    render() {
        return (
            <div className="form">
                <div className="form-container">
                    <div className="form-user-details">
                        <div className="form-user-details-container">

                            <div className="ui raised segment">
                                <span className="ui blue ribbon label">Success</span>
                            </div>

                            <h2>Thank you for your submission at For Mother Nature</h2>
                            <span>
                                Our administrator will review your submission.
                                You will soon get an email with further instruction.
                            </span>
                            
                            <div className="back-to-home">
                                <button className="ui primary button">
                                    <Link to="/" style={{ color: 'white' }}>
                                        Back to Home Page
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SuccessPage;