import React, { Component } from 'react';
import { 
  BrowserRouter as Router, 
  Route,
  Switch
} from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/passwordIndex';

import Home from './home/Home';
import About from './about/About';
import NoMatch from './noMatch/NoMatch';

import Navbar from './customNavbar/CustomNavbar';
import AdminApp from './administrator/AdminApp';
import ArtistApp from './artist/ArtistApp';
import OurArtists from './ourArtists/OurArtists';
import SideDrawer from './customNavbar/sideDrawer/sideDrawer';
import Backdrop from './customNavbar/backDrop/backDrop';
import FAQs from './faqs/faqsPage';
import Footer from './footer/Footer';
import enviromentalOrgs from './nonOrgs/nonOrgsPage';
import FirstTimeLogin from './firstTimeLogin/FirstTimeLogin';

import UserSignupForm from './userSignupForm/UserSignupForm';
import './App.css';


// import ForgotPW from './passwdForgot/PasswdForgot';
import ForgotPW from './passwdForgot/Password_forgot';

// import UserLogin from './login/Login';
import UserLogin from './login/userLogin';
import ResetPasswd from './resetPasswd/ResetPasswd';


import { removeHash } from 'react-scrollable-anchor';

const Landing = () => <h2>Landing</h2>

// const Child = ({ match }) => console.log('match', match) || (
//   <div>
//       <h3>ID: </h3>
//   </div>
// )


class App extends Component {
  constructor(props) {
    super(props)

    this.myRef = React.createRef()
    this.state = {
        scrollTop: 0,
        sideDrawerOpen: false
    }
  }

  // componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
  // It wires up with actionCreator
  componentDidMount() {
    this.props.fetchUser();
    // this.showMsg();
  };

  showMsg = () => {
    window.confirm("For better experience, we suggest you broswer this website with Google Chrome")
  }

  onScroll = () => {
    // const scrollY = window.scrollY;
    const scrollTop = this.myRef.current.scrollTop;

    this.setState({
      scrollTop: scrollTop
    })
    // console.log(`onScroll, window.scrollY: ${scrollY} myRef.scrollTop: ${scrollTop}`)
  };
  
  drawerToggleClickHandler = () => {
    this.setState((prevState) => ({
      sideDrawerOpen: !prevState.sideDrawerOpen
    }))
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false })
  };

  render() {
    removeHash();
    console.log("React version: ", React.version);
    // console.log("state.scrollTop: ", this.state.scrollTop)

    let backdrop;
    if(this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler}/>
    }

    if(this.props.auth.user) {
      if(this.props.auth.user.Administrator) {
        return <AdminApp />
      }
      if(this.props.auth.user.Artist) {
        return <ArtistApp />
      }
    }
 
    return (
      <div 
        className="App"
        ref={this.myRef}
        onScroll={this.onScroll}
      >
        <Router>
          <div className="App-container" >
              <Navbar 
                scrollYvalue={this.state.scrollTop}
                drawerClickHandler={this.drawerToggleClickHandler}
              />
              <SideDrawer show={this.state.sideDrawerOpen} />
              {backdrop}
              
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/about' component={About} />

              <Route path='/signup' component={UserSignupForm} />

              <Route path='/landing' component={Landing} />

              <Route path="/user/passwd-forgot" component={ForgotPW} />
              <Route path='/user/login' component={UserLogin} />
              <Route path="/recover/passwd_reset/:token" component={ResetPasswd} />

              <Route path="/enviromentalOrgs" component={enviromentalOrgs} />
              <Route path="/artists" component={OurArtists} />
              <Route path="/faqs" component={FAQs} />
              <Route path="/user/first-login/:token" component={FirstTimeLogin} />

              <Route path="/no_web_address" component={NoMatch} />
              <Route component={NoMatch} />

            </Switch>

            <Footer />
            
          </div>

        </Router>

      </div>
    );
  }
}

const mapStateToProps = (state) => {

  // console.log("state in App.js: ", state);
  return { 
    auth: state.auth
  };
}

export default connect(mapStateToProps, actions)(App);
// export default withRouter(connect(mapStateToProps, actions)(App));
