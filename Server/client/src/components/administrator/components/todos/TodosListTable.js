import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './commons.css';
import { Alert } from 'react-bootstrap';

class TodosTable extends React.Component {
    
    state = {
        checked: this.props.todo ? this.props.todo.TaskDone: false,
        saveClick: false  
    }

    checkboxHandler = (e) => {
        this.setState({
          checked: e.target.checked
        });
    }

    onSaveMSg = () => {
        this.setState((prevState) => ({
            saveClick: !prevState.saveClick
        }))

        setTimeout(() => {
            this.setState((prevState) => ({
                saveClick: !prevState.saveClick
            }))
        }, 1500);
    }

    render() {
        const { todo, deleteTask, saveTask } = this.props;
        // debugger
        if(this.state.checked) {
            todo.TaskDone = true
        } else {
            todo.TaskDone = false
        }

        return(
            <tr>
                <td>
                    <input 
                        type="checkbox"
                        onChange={this.checkboxHandler}
                        checked={this.state.checked}
                    />
                </td>

                <td className={this.state.checked ? 'task-done' : ''}>{todo.title}</td>
                <td className={this.state.checked ? 'task-done' : ''}>{todo.note}</td>

                <td>{todo.createdDate}</td>

                <td className="center aligned">
                    <i className="check icon" 
                        onClick={ () => {
                            saveTask(todo);
                            this.onSaveMSg();
                        }}
                    />
                    {this.state.saveClick ? <Alert bsStyle="success" bsSize="small">Save</Alert> : ''}
                </td>
                <td className="center aligned">
                    <Link to={`/todoList/${todo._id}`}>
                        <i className="pencil alternate icon center aligned" ></i>
                    </Link>
                </td>
                <td className="center aligned">
                    <i className="trash alternate icon" onClick={() => deleteTask(todo._id)}></i>
                </td>
            </tr>
        );
    }
}

TodosTable.propTypes = {
    todo: PropTypes.object.isRequired,
    deleteTask: PropTypes.func.isRequired,
    saveTask: PropTypes.func.isRequired
}

export default TodosTable;