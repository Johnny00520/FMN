import React from 'react';
import PropTypes from 'prop-types';
import TodosListTable from './TodosListTable';
import { Table } from 'react-bootstrap';
import { getTodosList, deleteTask, saveTask } from '../../../../actions/todoListCRUD';
import { connect } from 'react-redux';
import './commons.css';

const TodosList = ({ todos, deleteTask, saveTask }) => {
    // debugger

    const emptyMessage = (
        <p>There are no todos list in your collection</p>
    )

    const todosList = () => (
        <div className="table-container">
            <Table responsive striped bordered condensed hover>

                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Task</th>
                        <th>Adding Date</th>
                        <th colSpan="3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {todos.map(todo => 
                        <TodosListTable 
                            todo={todo} 
                            key={todo._id}
                            saveTask={saveTask}
                            deleteTask={deleteTask} 
                        />)}
                </tbody>
            </Table>
        </div>
    )
    return (
        <div>
            {todos.length === 0 ? emptyMessage : todosList()}
        </div>
    )
}

TodosList.propTypes = {
    todos: PropTypes.array.isRequired,
    deleteTask: PropTypes.func.isRequired,
    saveTask: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    // console.log("state in TodosPage: ", state)
    return {
        todos: state.todos
    }
}

export default connect(mapStateToProps, { 
    getTodosList,
    deleteTask,
    saveTask
})(TodosList);