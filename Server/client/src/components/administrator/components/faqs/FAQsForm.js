import React, { Component } from 'react'
import classNames from 'classnames';
import { connect } from 'react-redux';
import { saveFAQ, fetchFAQ, updateFAQ } from '../../../../actions/faqsCRUD';
import { Redirect } from 'react-router';


class FAQsForm extends Component {
    state = {
        _id: this.props.faq ? this.props.faq._id : null,
        question: this.props.faq ? this.props.faq.question : '',
        answer: this.props.faq ? this.props.faq.answer : '',
        errors: {},
        loading: false,
        done: false
    }

    componentDidMount = () => {
        if(this.props.params) {
            this.props.fetchFAQ(this.props.params);
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            _id: nextProps.faq._id,
            question: nextProps.faq.question,
            answer: nextProps.faq.answer
        })
    }

    handleChange = input => e => {
        if(!!this.state.errors[e.target.name]) {
            let errors = Object.assign({}, this.state.errors )
            delete errors[e.target.name]
    
            this.setState({ 
                [input] : e.target.value,
                errors
            });
        } else {
            this.setState({ 
                [input] : e.target.value
            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};
        if(this.state.question === '') errors.question = 'Cannot be empty';
        if(this.state.answer === '') errors.answer = 'Cannot be empty';
        this.setState({ errors });
        const isValid = Object.keys(errors).length === 0;

        if(isValid) {
            const { _id, question, answer } = this.state;
            this.setState({ loading: true })

            if(_id) {
                this.props.updateFAQ({ _id, question, answer })
                .then(() => {
                    this.setState({ done: true })
                }, (err) => {
                    err.response.json()
                    .then(({ errors }) => this.setState({ errors, loading: false }))
                });

            } else {
                this.props.saveFAQ({ question, answer })
                .then(() => {
                    this.setState({ done: true })
                }, (err) => {
                    err.response.json()
                    .then(({ errors }) => this.setState({ errors, loading: false }))
                });
            }
        }
    }

    render() {
        const form = (
            <form className={classNames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
                <h1>Add new FAQs</h1>

                {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

                <div className={classNames('field', { error : !!this.state.errors.question })}>
                    <label htmlFor="question">Question</label>
                    <input
                        id="question"
                        name="question"
                        defaultValue={this.state.question}
                        placeholder="Question..."
                        onChange={this.handleChange('question')}
                    />
                    <span>{this.state.errors.question}</span>
                </div>

                <div className={classNames('field', { error : !!this.state.errors.answer })}>
                    <label htmlFor="answer">Answer</label>
                    <textarea
                        rows="4"
                        id="answer"
                        name="answer"
                        defaultValue={this.state.answer}
                        placeholder="Put answer here..."
                        onChange={this.handleChange('answer')}
                    />
                    <span>{this.state.errors.answer}</span>
                </div>

                <div className="field">
                    <button className="ui primary button">save</button>
                </div>

            </form>
        )
        return (
            <div className="faqs-form-container">
                {this.state.done ? <Redirect to="/faqs/currentList" /> : form}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    if(props.params) {
        return {
            faq: state.faqs.find(item => item._id === props.params)
        }
    }
    return { faq: null }
}

export default connect(mapStateToProps, { saveFAQ, fetchFAQ, updateFAQ })(FAQsForm);
