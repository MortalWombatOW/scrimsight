import React from 'react';
import PropTypes from 'prop-types';
import './Block.css';

const Block = (props) => (
  <div className="Block">
    <div className="BlockTitle">{props.title}</div>
    {props.children}
  </div>
);

Block.propTypes = {};

Block.defaultProps = {};

export default Block;
