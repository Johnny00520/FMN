import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Welcome from './sections/welcome/welcome';
import HomepageArtists from './sections/artists/homepageArtists';
import EnvironmentalOrgs from './sections/environmentalOrgs/environmentalOrgs';
import MakeDiff from './sections/makeDiff/MakeDiff';
import Blogs from './sections/blogs/Blogs';

// import ScrollableAnchor from 'react-scrollable-anchor';
import { configureAnchors } from 'react-scrollable-anchor'
import PropTypes from "prop-types";
import './Home.css';

// import actions from 'redux-form/lib/actions';
// import * as actions from '../../actions/index';

const dots = [
    { className: 'navDots', name: 'Home', section: "#home", num: '1', to:"#home"},
    { className: 'navDots', name: 'Welcome', section: "#welcome", num: '2', to:"#welcome"},
    { className: 'navDots', name: 'Artists', section: "#artists", num: '3', to:"#artistsSections"},
    { className: 'navDots', name: 'EnvOrgs', section: "#envOrgs", num: '4', to:"#envOrgs"},
    { className: 'navDots', name: 'MakeDiff', section: "#makeDiff", num: '5', to:"#makeDiff"},
    { className: 'navDots', name: 'Blogs', section: "#blogs", num: '6', to:"#blog"}
]

class PageSection extends Component {
    render() {
        return this.props.content;
    }
}

PageSection.propTypes = {
    content: PropTypes.node.isRequired
}

// const Welcome = props => {
//     return (<div {...props}>Welcome!</div>)
// }

// const HomepageArtists = props => {
//     return (<div {...props}>These are artists!</div>)
// }

class Home extends Component {
    componentDidMount() {
        configureAnchors({offset: 60, scrollDuration: 200});
    }


    renderContent = () => {
        // console.log("auth.user: ", this.props.auth.user);
        switch(this.props.auth.user) {
            case null:
                // App still tries to figure out if the user is logining
                return null;

            case false:
                // If not, show Signup button
                return (
                    <div>
                        {/* <SignUp /> */}
                        <Link to="/signup">
                            <Button>
                                Sign up
                            </Button>
                        </Link>
                    </div>
                );

            default:
                // I'm login in
                return (
                    <Button bsStyle="primary" href="/api/logout">Log out</Button>
                );
        }
    }

    render() {
        // debugger

        return (
            <div>
                <section id="home">
                    <div className="homepage">
                        <div className="homepage-title">
                            
                            <h1>For Mother Nature</h1>
                            <p>For Art sake</p>
                            {this.renderContent()}
                            <Button bsStyle="info" bsSize="large">
                                <a href="#welcome">
                                    Learn more
                                </a>
                            </Button>
                        </div>

                        <div className="dots-container">

                            <div className="dots-group">
                                {dots.map((dot) => (
                                    <div className="dots" key={dot.name}>
                                        <a href={dot.section} key={dot.name}>
                                            <span className={dot.className} key={dot.name}>
                                                
                                                    <span className={dot.name}>
                                                        {dot.name}
                                                    </span>
                                            </span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* <ScrollableAnchor id={"welcome"}>
                    <PageSection content={<Welcome />} />
                </ScrollableAnchor>
                <ScrollableAnchor id={"artists"}>
                    <PageSection content={<HomepageArtists />} />
                </ScrollableAnchor> */}
                
                {/* <section id='home'>
                    <PageSection content={<Home />} />
                 </section> */}
                 <section id='welcome'>
                    <PageSection content={<Welcome />} />
                 </section>
                 <section id='artists'>
                    <PageSection content={<HomepageArtists />} />
                 </section> 
                 <section id='envOrgs'>
                    <PageSection content={<EnvironmentalOrgs />} />
                 </section> 
                 <section id='makeDiff'>
                    <PageSection content={<MakeDiff />} />
                 </section> 
                 <section id='blogs'>
                    <PageSection content={<Blogs />} />
                 </section> 

            </div>
        )
    }
}

function mapStateToProps(state) {
    // debugger
    return { 
        auth: state.auth,
        // usersList: state.users
    }
}


// export default connect(mapStateToProps, actions )(Home);
export default connect(mapStateToProps)(Home);
