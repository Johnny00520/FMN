import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import TodosList from './TodosList';
import { getTodosList, deleteTask, saveTask, searchTasks } from '../../../../actions/todoListCRUD';
import TodosForm from './TodosForm';
import TodosSearchBar from './TodosSearch';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

const TodosNav = props => (
    <div>
        <div className="ui container">
            <div className="ui two item menu">
                <NavLink 
                    className="item" 
                    activeClassName="active" 
                    to="/todosList/currentList"
                >
                    Todo List
                </NavLink>
                <NavLink 
                    className="item" 
                    activeClassName="active" 
                    to="/todosList/addNewTask"
                >
                    Add New Task
                </NavLink>
            </div>
        </div>
    </div>
)

const routes = [
    { path: '/todosList/currentList', exact: true, main: () => <TodosList /> },
    { path: '/todosList/addNewTask', exact: true, main: () => <TodosForm /> },
    { path: '/todoList/:_id', exact: true, main:((routerProps) => <TodosForm paramsMatch={routerProps.match.params._id} />)},
]

class TodosPage extends Component {

    componentDidMount() {
        this.props.getTodosList();
    }

    render() {
        return (
            <div className="todos-page">
                <Router>
                    <div className="todos-page-container">
                        <h1 style={{ textAlign: 'center' }}> TodoList Page </h1>                        
                        <TodosNav />

                        <TodosSearchBar/>

                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                component={route.main}
                            >    
                            </Route>
                        ))}
                    </div>
                </Router>
            </div>
        )
    }
}

TodosPage.propTypes = {
    todos: PropTypes.array.isRequired,
    getTodosList: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    saveTask: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    // console.log("state in TodosPage: ", state)
    return {
        todos: state.todos
    }
}

export default connect(mapStateToProps, { getTodosList, deleteTask, saveTask, searchTasks })(TodosPage);