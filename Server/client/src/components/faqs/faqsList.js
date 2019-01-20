import React from 'react'

const faqsList = ({ faq }) => {

    const empty = (
        <p>Nothing in here</p>
    )

    const faqsList = (
        <div className="faq-list-container">
            <div className="faq-list-question">
                <b>
                    <p className="question"><i className="question circle icon"></i>{faq.question}</p>
                </b>
            </div>
            <div className="faq-list-answer">
                <p className="answer">{faq.answer}</p>
            </div>
        </div>
    )

    return (
        <div className="faqs-list">
            {faq.length === 0 ? empty : faqsList}
        </div>
    )
}

export default faqsList;