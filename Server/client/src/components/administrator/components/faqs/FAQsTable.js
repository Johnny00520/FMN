import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const FAQsTable = ({ faq, deleteFAQ }) => {
    return (
        <tr>
            <td>{faq.question}</td>
            <td>{faq.answer}</td>
            <td className="center aligned">
                <Link to={`/faqs/addNewFAQ/${faq._id}`}>
                    <i className="pencil alternate icon center aligned" ></i>
                </Link>
            </td>
            <td className="center aligned">
                <i className="trash alternate icon" onClick={() => deleteFAQ(faq._id)}></i>
            </td>
        </tr>
    )
}

FAQsTable.propTypes = {
    faq: PropTypes.object.isRequired,
    deleteFAQ: PropTypes.func.isRequired
}

export default FAQsTable;

