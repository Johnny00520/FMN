import React, { Component } from 'react';
// import CoverFlow from 'coverflow-react';
import SlideShow from 'react-image-show';

class ArtworksSlider extends Component {
    render() {

        return (
            <SlideShow
                images={this.props.imagesArray}
                width="920px"
                imagesWidth="800px"
                imagesHeight="450px"
                imagesHeightMobile="56vw"
                thumbnailsWidth="920px"
                thumbnailsHeight="12vw"
                indicators thumbnails fixedImagesHeight
                infinite={true}
            >
            </SlideShow>
        )
    }
}


export default ArtworksSlider;

// {/* <div className="artwork-coverflow">            
//             {/* CoverFlow */}
//             {/* {user.artWorkImagesPath ? 
//             <CoverFlow 
//                 imagesArr={user.artWorkImagesPath} 
//                 direction="horizontal"
//                 width={width}
//                 height={height}
//                 itemRatio="10:5"
//                 background="#eff9ec"
//             />: ''} */}
            

//             {/* ImageGallery */}
//             {/* {user.artWorkImagesPath ? <ImageGallery items={user.artWorkImagesPath}/> : ''} */}

//         </div> */}