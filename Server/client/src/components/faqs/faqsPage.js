import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchFAQs } from '../../actions/faqsCRUD';
import FAQsList from './faqsList';

import './common.css';

export class faqsPage extends Component {
    componentDidMount = () => {
        this.props.fetchFAQs();
    }
    render() {
        return (
            <div>
                <div className="faqs-page">
                    <div className="faqs-page-container">
                        <div className="faqs-page-content">
                            <div className="faqs-page-title">
                                <div className="ui black ribbon label">
                                    <i className="question circle outline icon"></i>Frequently Asked Questions
                                </div>
                            </div>
                            {this.props.faqs.map(faq => <FAQsList faq={faq} key={faq._id} />)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        faqs: state.faqs
    }
}

export default connect(mapStateToProps, { fetchFAQs })(faqsPage);
