/* eslint-disable max-len */
import React from 'react';
import propTypes from 'prop-types';
import {
  LightgalleryItem,
} from 'react-lightgallery';
import { Image } from 'react-bootstrap';
import Default from '../../assets/img/default.png';

function PhotoItem({
  image, thumb, group,
}) {
  return (
    <LightgalleryItem group={group} src={image} thumb={thumb} itemClassName="col-md-4">
      <Image
        src={image === '' ? Default : image}
        thumbnail
        rounded
      />
    </LightgalleryItem>
  );
}

PhotoItem.propTypes = {
  image: propTypes.string.isRequired,
  group: propTypes.string.isRequired,
};

export default PhotoItem;
