import React, { Component } from 'react';
import './welcome.css';

// const Welcome = props => (
class Welcome extends Component {
    render() {
        return (
            <div className="welcome-section">
                <div className="welcome-title">
                    <h1>Welcome Page</h1>
                
                <p>Working together we can save the remaining natural places on Earth. Here you can find talented artists and artisans supporting
                    environmental organizations. Purchasing handcrafted items from them supports the arts AND the planet. Artists pledge a portion of
                    their sales to the environmental nonprofit of their choosing. The donation pledge is based on sales from all sources, whether to a
                    ForMotherNature visitor or to another customer. Some artists donate from all their artwork while others donate from a particular
                    series.   In this way, artwork becomes imbued with purpose, part of the urgent effort to save wildlife and wild places.</p>
                </div>
            </div>
        )
    }
}

export default Welcome;