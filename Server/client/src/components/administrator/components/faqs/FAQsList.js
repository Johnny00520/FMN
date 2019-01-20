import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import FAQsTable from './FAQsTable';
import './common.css';

const FAQsList = ({ faqs, deleteFAQ }) => {
    const emptyMsg = (
        <p>There are no faqs in your collection</p>
    )

    const faqsList = (
        <div className="table-container">
            <Table responsive striped bordered condensed hover>
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {faqs.map(faq => <FAQsTable faq={faq} key={faq._id} deleteFAQ={deleteFAQ} />)}
                </tbody>
            </Table>
        </div>

    )
    return (
        <div>
            {faqs.length === 0 ? emptyMsg : faqsList}
        </div>
    )
}

FAQsList.propTypes = {
    faqs: PropTypes.array.isRequired,
}

export default FAQsList;
