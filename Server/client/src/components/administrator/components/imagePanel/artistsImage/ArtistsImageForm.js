import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { saveArtist, fetchExistingArtist, updateArtist } from '../../../../../actions/artistImageCRUD';
import { Redirect } from 'react-router';

class ArtistsImageForm extends Component {
    state = {
        _id: this.props.artist ? this.props.artist._id : null,

        firstname: this.props.artist ? this.props.artist.firstname : '',
        lastname: this.props.artist ? this.props.artist.lastname : '',
        email: this.props.artist ? this.props.artist.email: '',
        websiteAddress: this.props.artist ? this.props.artist.websiteAddress: '',
        facebook: this.props.artist ? this.props.artist.facebook: '',
        otherLink1: this.props.artist ? this.props.artist.otherLink1: '',
        otherLink2: this.props.artist ? this.props.artist.otherLink2: '',
        otherLink3: this.props.artist ? this.props.artist.otherLink3: '',
        pleage1: this.props.artist ? this.props.artist.pleage1: '',
        pleage1Percent: this.props.artist ? this.props.artist.pleage1Percent : '',
        pleage2: this.props.artist ? this.props.artist.pleage2: '',
        pleage2Percent: this.props.artist ? this.props.artist.pleage2Percent : '',
        notes: this.props.artist ? this.props.artist.notes : '',
        profileImage: null,
        artworkImages: [],

        errors: {},
        loading: false,
        done: false,
    }

    componentWillReceiveProps = (nextProps) => {
        // debugger
        this.setState({
            _id: nextProps.artist._id,
            firstname: nextProps.artist.firstname,
            lastname: nextProps.artist.lastname,
            websiteAddress: nextProps.artist.websiteAddress,
            facebook: nextProps.artist.facebook,
            otherLink1: nextProps.artist.otherLink1,
            otherLink2: nextProps.artist.otherLink2,
            otherLink3: nextProps.artist.otherLink3,
            pleage1: nextProps.artist.pleage1,
            pleage2: nextProps.artist.pleage2,
            pleage1Percent: nextProps.artist.pleage1Percent,
            pleage2Percent: nextProps.artist.pleage2Percent,
            notes: nextProps.artist.notes,
        })
    }

    componentDidMount = () => {
        // debugger
        if(this.props.params) {
            this.props.fetchExistingArtist(this.props.params);
        }
    }

    handleChange = (e) => {

        if(!!this.state.errors[e.target.name]) {
            let errors = Object.assign({}, this.state.errors);
            delete errors[e.target.name];
    
            this.setState({ 
                [e.target.name]: e.target.value,
                errors
            });
        } else {
            this.setState({ 
                [e.target.name]: e.target.value 
            });
        }
    }

    profileHandleChange = (e) => {
        this.setState({
            profileImage: e.target.files[0]
        });
    }

    artworkFilesHandleChange = (e) => {
        // let artworkImages = [];
        // artworkImages.push(e.target.files);

        this.setState({
            artworkImages: [...this.state.artworkImages, e.target.files]
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};
        if(this.state.firstname === '') errors.firstname = 'Cannot be empty';
        if(this.state.lastname === '') errors.lastname = 'Cannot be empty';
        if(this.state.email === '') errors.email = 'Cannot be empty';
        if(this.state.notes === '') errors.notes = 'Cannot be empty';

        this.setState({ errors });

        const isValid = Object.keys(errors).length === 0;
        
        if(isValid) {
            const { 
                _id, 
                firstname, 
                lastname,
                email,
                websiteAddress,
                facebook,
                otherLink1,
                otherLink2,
                otherLink3,
                pleage1,
                pleage1Percent,
                pleage2,
                pleage2Percent,
                notes,
                profileImage,
                artworkImages
            } = this.state;

            this.setState({ loading: true });

            if(_id) {
                this.props.updateArtist({
                    _id, 
                    firstname, 
                    lastname,
                    email,
                    websiteAddress,
                    facebook,
                    otherLink1,
                    otherLink2,
                    otherLink3,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent,
                    notes,
                    profileImage,
                    artworkImages
                })
                .then(
                    () => { this.setState({ done: true })},
                    (err) => err.response.json().then(({ errors }) => this.setState({ errors, loading: false }))
                )
            } else {

                this.props.saveArtist({
                    _id, 
                    firstname, 
                    lastname,
                    email,
                    websiteAddress,
                    facebook,
                    otherLink1,
                    otherLink2,
                    otherLink3,
                    pleage1,
                    pleage1Percent,
                    pleage2,
                    pleage2Percent,
                    notes,
                    profileImage,
                    artworkImages
                })
                .then(
                    () => { this.setState({ done: true })},
                    (err) => err.response.json().then(({ errors }) => this.setState({ errors, loading: false }))
                )
            }


        }
    }

    render() {
        const form = (
            <div className="ui  container">

                <form className={classnames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
                    <h1>Add/Edit new Artist</h1>

                    {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

                    <div className="two fields">
                        <div className={classnames('field', { error: !!this.state.errors.firstname })}>
                            <label htmlFor="firstname">First name *</label>
                            <input
                                id="firstname"
                                placeholder="firstname"
                                name="firstname"
                                value={this.state.firstname}
                                onChange={this.handleChange}
                            />
                            <span>{this.state.errors.firstname}</span>
                        </div>
                        <div className={classnames('field', {error: !!this.state.errors.lastname })}>
                            <label htmlFor="lastname">Last Name *</label>
                            <input
                                name="lastname"
                                value={this.state.lastname || ''}
                                onChange={this.handleChange}
                                id="lastname"
                                placeholder="Enter last name..."
                            />
                            <span className="error-msg-color">{this.state.errors.lastname}</span>
                        </div>
                    </div>

                    <div className={classnames('field', {error: !!this.state.errors.email })}>
                        <label htmlFor="email">Email *</label>
                        <input
                            name="email"
                            value={this.state.email || ''}
                            onChange={this.handleChange}
                            id="email"
                            placeholder="Enter email address..."
                        />
                        <span className="error-msg-color">{this.state.errors.email}</span>
                    </div>

                    <div className="field">
                        <label htmlFor="file">Picture: (Only support .jpg .jpeg .png)</label>
                        <input 
                            type="file"
                            encType="multipart/form-data"
                            id="file"
                            name="image"
                            accept="image/*"
                            onChange={this.profileHandleChange}
                            placeholder="If you already had a profile picture, doing this will replace your original profile picture.."
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="file">Artworks Pictures: (Only support .jpg .jpeg .png)</label>
                        <input 
                            type="file"
                            encType="multipart/form-data"
                            id="file"
                            name="image"
                            accept="image/*"
                            multiple
                            onChange={this.artworkFilesHandleChange}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="websiteAddress">Website Address</label>
                        <input
                            name="websiteAddress"
                            value={this.state.websiteAddress || ''}
                            onChange={this.handleChange}
                            id="websiteAddress"
                            placeholder="Enter website..."
                        />
                        <span className="error-msg-color">{this.state.errors.websiteAddress}</span>
                    </div>

                    <div className="field">
                        <label htmlFor="facebook">Facebook</label>
                        <input
                            name="facebook"
                            value={this.state.facebook || ''}
                            onChange={this.handleChange}
                            id="facebook"
                            placeholder="Enter facebook..."
                        />
                        <span className="error-msg-color">{this.state.errors.facebook}</span>
                    </div>


                    <div className="field">
                        <label htmlFor="otherLink1">Other links</label>
                        <input 
                            id="otherLink1"
                            name="otherLink1"
                            placeholder="Enter the first additional link if you have..."
                            onChange={this.handleChange}
                            value={this.state.otherLink1}
                        />
                    </div>
                    <div className="field">
                        <input 
                            id="otherLink2"
                            name="otherLink2"
                            placeholder="Enter the second additional link if you have..."
                            onChange={this.handleChange}
                            value={this.state.otherLink2}

                        />
                    </div>
                    <div className="field">
                        <input 
                            id="otherLink3"
                            name="otherLink3"
                            placeholder="Enter the third additional link if you have..."
                            onChange={this.handleChange}
                            value={this.state.otherLink3}
                        />
                    </div>

                    <label htmlFor="pleages">Pleages</label>
                    <div className="two fields">
                        <div className="field">
                            <input
                                id="pleages"
                                name="pleage1"
                                placeholder="Enter the first pleage if you have any..."
                                onChange={this.handleChange}
                                value={this.state.pleage1}
                            />
                        </div>
                        <div className="field">
                            <input
                                name="pleage1Percent"
                                placeholder="How many %?"
                                onChange={this.handleChange}
                                value={this.state.pleage1Percent}
                            />
                        </div>
                    </div>

                    <div className="two fields">
                        <div className="field">
                            <input
                                name="pleage2"
                                placeholder="Enter the second pleage if you have any..."
                                onChange={this.handleChange}
                                value={this.state.pleage2}
                            />
                        </div>
                        <div className="field">
                            <input
                                name="pleage2Percent"
                                placeholder="How many %?"
                                onChange={this.handleChange}
                                value={this.state.pleage2Percent}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="notes">Notes *</label>
                        <textarea
                            rows="4"
                            id="notes"
                            name="notes"
                            placeholder="Any note about the new artist?"
                            onChange={this.handleChange}
                            value={this.state.notes || ''}
                        />
                    </div>


                    <div className="field">
                        <button className="ui primary button">Save</button>
                    </div>

                </form>
            </div>
        )
        return(
            <div>
                {this.state.done ? <Redirect to="/image_panel/allImagesList" /> : form}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    // debugger
    if(props.params) {
        // debugger
        return {
            artist: state.artistsAndartworksImages.find(item => item._id === props.params)
        }
    }
    return { artist: null }
}

export default connect(mapStateToProps, {
    saveArtist,
    fetchExistingArtist,
    updateArtist
})(ArtistsImageForm);