import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchFAQs, deleteFAQ } from '../../../../actions/faqsCRUD';
import PropTypes from 'prop-types';
import FAQsList from './FAQsList';

export class FAQsExisting extends Component {
    componentDidMount = () => {
        this.props.fetchFAQs();
    }
    render() {
        return <FAQsList faqs={this.props.faqs} deleteFAQ={this.props.deleteFAQ}/>
    }
}

FAQsExisting.propTypes = {
    faqs: PropTypes.array.isRequired,
    fetchFAQs: PropTypes.func.isRequired,
    deleteFAQ: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    // console.log("state in FAQsExisting: ", state.faqs)
    return {
        faqs: state.faqs
    }
}

export default connect(mapStateToProps, { fetchFAQs, deleteFAQ })(FAQsExisting);