import React from 'react';
import {
  LightgalleryProvider,
} from 'react-lightgallery';
import PhotoItem from './PhotoItem';

class ImageViewer extends React.Component {
  render() {
    const { images, group } = this.props;

    const displayImages = [...new Set(images)];
    return (
      <LightgalleryProvider lightgallerySettings={{
        iframe: false,
      }}
      >
        <div
          className="row"
        >
          {displayImages.map((p, idx) => (
            <PhotoItem key={idx} image={p} group={group} display={displayImages.length === 1 ? 'default_img' : ''} thumb={p} />
          ))}
        </div>
      </LightgalleryProvider>
    );
  }
}

export default ImageViewer;
