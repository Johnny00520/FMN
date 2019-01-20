import React from 'react';
import './navbarToggleButton.css';

const navbarTogglebutton = props => (
    <button className="toggle-button" onClick={props.click} >
        <div className="toggle-button_line" />
        <div className="toggle-button_line" />
        <div className="toggle-button_line" />
    </button>
)

export default navbarTogglebutton;