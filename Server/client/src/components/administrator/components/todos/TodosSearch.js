import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTodosList, searchTasks, selectSort } from '../../../../actions/todoListCRUD';

class TodosSearchBar extends Component {

    state = {
        searchTerm: '',
        errors: {},
        checked: false,
        sortSelection: ''
    }

    onInputChange = (e) => {
        this.setState({ searchTerm: e.target.value }, () => {
            if(this.state.searchTerm.length > 0) {
                this.props.searchTasks(this.state.searchTerm.trim().toLowerCase());
            } else {
                this.props.getTodosList();
            }
        });
    }

    onSelectionChange = (e) => {
        const { value } = e.target
        // console.log("value:" , value)
        this.setState({ sortSelection: value });

        this.props.selectSort(value);
    }

    render() {
        const { sortSelection } = this.state

        return (

            <div className="search-container">
                <div className="ui right action left icon input" style={{width: '85%'}}>
                    <i className="search icon" style={{ marginTop: '1.6rem'}}></i>

                    <input 
                        type="text" 
                        placeholder="Search Task Title..."
                        onChange={this.onInputChange}
                        style={{ height: '70%', marginTop: '5%'}}
                    />

                    <div className="ui form" style={{ height: '100%', marginTop: '5%'}}>
                        <div className="inline fields">
                            <div className="field">
                                <select 
                                    className="ui dropdown" 
                                    value={this.state.sortSelection} 
                                    onChange={this.onSelectionChange}
                                >
                                    <option value="">Sort By Time</option>
                                    <option value="aescending">Aescending</option>
                                    <option value="descending">Descending</option>
                                </select>


                            </div>
                            <div className="field">
                                <div className="ui radio checkbox">
                                    {/* <input type="radio" name="frequency" checked="checked" /> */}
                                    <input
                                        id="active"
                                        value="active"
                                        name="active"
                                        type="radio" 
                                        onChange={this.onSelectionChange}
                                        checked={sortSelection === 'active'}
                                    />
                                    <label htmlFor="active">Active</label>
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui radio checkbox">
                                    <input
                                        id="completed"
                                        value="completed"
                                        name="completed" 
                                        type="radio" 
                                        onChange={this.onSelectionChange}
                                        checked={sortSelection === 'completed'}
                                    />
                                    <label htmlFor="completed">Completed</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        todos: state.todos
    }
}

export default connect(mapStateToProps, { getTodosList, searchTasks, selectSort })(TodosSearchBar);