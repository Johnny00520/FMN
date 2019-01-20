import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import ArtistsImageCard from './adminsImage/adminImageCard';
import AdminImageCard from './adminsImage/adminImageCard';
import NonOrgsCard from './nonOrgsImage/NonOrgsImageCard';
import ArtistImageCard from './artistsImage/artistsImageCard';

import { deleteAdmin } from '../../../../actions/adminImageCRUD';
import { deleteOrgImage } from '../../../../actions/nonOrgImageCRUD';
import { deleteArtist, deleteArtistImage } from '../../../../actions/artistImageCRUD';

const ImagesList = ({ adminsList, artistsAndartworksList, nonOrgsList, deleteAdmin, deleteOrgImage, deleteArtist, deleteArtistImage }) => {
    // debugger
    const emptyMessage = (
        <p>There is no artist/admin/non profit org image in your collection</p>
    )
    
    const AllAdminImageList = (deleteAdmin) => {
        // debugger
        return (
            <div>
                <div className="ui centered stackable cards">
                    {adminsList.map(adminList => <AdminImageCard user={adminList} key={adminList._id} deleteAdmin={deleteAdmin} /> )}
                </div>
            </div>
        )
    }

    const AllArtistImageList = (deleteArtist) => {
        return(
            <div className="ui container">
                <div className="ui cards">
                {artistsAndartworksList.map(artistAndartworksList => 
                    <ArtistImageCard 
                        user={artistAndartworksList} 
                        key={artistAndartworksList._id} 
                        deleteArtist={deleteArtist}
                        deleteArtistImage={deleteArtistImage}
                    /> )}

                </div>
            </div>
        )
    }
    
    const AllNonProfOrgs = (deleteOrgImage) => {
        return (
            <div>
                <div className="ui centered stackable cards">
                    {nonOrgsList.map(nonOrgList => <NonOrgsCard nonOrg={nonOrgList} key={nonOrgList._id} deleteOrgImage={deleteOrgImage} /> )}
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1>Administrators</h1>
            {adminsList.length === 0 ? emptyMessage : AllAdminImageList(deleteAdmin)}
            <h1>Artists</h1>
            {artistsAndartworksList.length === 0 ? emptyMessage : AllArtistImageList(deleteArtist)}
            <h1>Non Profit Organizations</h1>
            {nonOrgsList.length === 0 ? emptyMessage : AllNonProfOrgs(deleteOrgImage)}
        </div>
    )
}

ImagesList.propTypes = {
    // usersList: PropTypes.array.isRequired,
    adminsList: PropTypes.array.isRequired,
    nonOrgsList: PropTypes.array.isRequired,
    artistsAndartworksList: PropTypes.array.isRequired,
    deleteAdmin: PropTypes.func.isRequired,
    deleteOrgImage: PropTypes.func.isRequired,
    deleteArtist: PropTypes.func.isRequired,
    deleteArtistImage: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    // console.log("state.users in ImagesList: ", state.users)
    // console.log("state.adminImages: ", state.adminImages)
    // console.log("state.nonOrgsImages: ", state.nonOrgsImages)
    // console.log("state.artistsAndartworksImages: ", state.artistsAndartworksImages)

    return { 
        adminsList: state.adminImages,
        nonOrgsList: state.nonOrgsImages,
        artistsAndartworksList: state.artistsAndartworksImages
    }
}

export default connect(mapStateToProps, { 
    deleteAdmin,
    deleteOrgImage,
    deleteArtist,
    deleteArtistImage
})(ImagesList);