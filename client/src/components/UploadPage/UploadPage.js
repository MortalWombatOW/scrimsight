import React from 'react';
import PropTypes from 'prop-types';
import './UploadPage.css';
import MapUpload from '../MapUpload/MapUpload';

const UploadPage = () => (
  <div className="UploadPage">
    <MapUpload></MapUpload>
  </div>
);

UploadPage.propTypes = {};

UploadPage.defaultProps = {};

export default UploadPage;
