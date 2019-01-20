import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { addTodoList, getTodoList, updateTask } from '../../../../actions/todoListCRUD';
import { Redirect } from 'react-router';


class TodosForm extends React.Component {
    state = {
        _id: this.props.task ? this.props.task._id : null,
        title: this.props.task ? this.props.task.title : '',
        note: this.props.task ? this.props.task.note : '',
        errors: {},
        loading: false,
        done: false
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            _id: nextProps.task._id,
            title: nextProps.task.title,
            note: nextProps.task.note
        });
    }

    componentDidMount = () => {
        if(this.props.paramsMatch) {
            this.props.getTodoList(this.props.paramsMatch);
        }
    }

    handleChange = (e) => {
        if(!!this.state.errors[e.target.name]) {
            let errors = Object.assign({}, this.state.errors );
            delete errors[e.target.name];
    
            this.setState({ 
                [e.target.name]: e.target.value,
                errors
            });

        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        // validation
        let errors = {}
        if(this.state.title === '') errors.title = 'Cannot be empty';
        if(this.state.note === '') errors.note = 'Cannot be empty';

        this.setState({ errors });

        const isValid = Object.keys(errors).length === 0;

        if(isValid) {
            const { _id, title, note } = this.state; 

            this.setState({ loading: true });

            // update route if there is a _id
            if(_id) {
                this.props.updateTask({ _id, title, note }).then(
                    () => { this.setState({ done: true })},    
                    (err) => err.response.json().then(
                        ({ errors }) => this.setState({ errors, loading: false }))
                );

            } else {
                // Otherwise, add route for a new task
                this.props.addTodoList({ title, note }).then( 
                    () => { this.setState({ done: true }) },
                    (err) => err.response.json().then(
                        ({ errors }) => this.setState({ errors, loading: false }))
                )
            }
        }
    }

    render() {

        const form = (
            <form className={classNames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
                <div className="fields-container">
                    <h1>Add new task</h1>

                    {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

                    <div className={classNames('field', { error: !!this.state.errors.title })}>
                        <label htmlFor="title">Title</label>
                        <input
                            name="title"
                            value={this.state.title || ''}
                            onChange={this.handleChange}
                            id="title"
                        />
                        <span>{this.state.errors.title}</span>
                    </div>

                    <div className={classNames('field', { error: !!this.state.errors.note })}>
                        <label htmlFor="note">Note</label>
                        <textarea
                            name="note"
                            value={this.state.note || ''}
                            onChange={this.handleChange}
                            id="note"
                        />
                        <span>{this.state.errors.note}</span>
                    </div>

                    <div className="field">
                        <button className="ui primary button">Submit</button>
                    </div>
                </div>
            </form>
        )

        return (
            <div>
                {this.state.done ? <Redirect to="/todosList/currentList" /> : form }

            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    // The todo id should be the same as the one admin provided
    // console.log("props.paramsMatch in TodosListForm: ", props.paramsMatch);
    // console.log("state.tasks in TodosListForm: ", state);
    if(props.paramsMatch) {
        // debugger
        return {
            // user: state.users.find(item => item._id === props.paramsMatch._id)
            task: state.todos.find(item => item._id === props.paramsMatch)
        }
    }

    //Otherwise
    return { task: null };
}

export default connect(mapStateToProps, { addTodoList, getTodoList, updateTask })(TodosForm);