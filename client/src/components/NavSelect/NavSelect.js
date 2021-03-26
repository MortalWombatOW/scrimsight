import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './NavSelect.css';
import arrow from '../../img/keyboard_arrow_down-24px.svg';

const toggleDialog = (open, setOpen) => {
  console.log('hi')
  return () => setOpen(!open);
};

const NavSelect = (props) => {
  const [open, setOpen] = useState(false);

  return (
  <div className="dropWrapper">
    <div className="NavSelect" onClick={toggleDialog(open, setOpen)}>
      {props.children}
      <img className={open ? "arrow open" : "arrow"} src={arrow}></img>
    </div>
    {open ? (<div><div className="dropdownbg" onClick={toggleDialog(open, setOpen)}></div><div className="dropdown">{props.dropdown()}</div></div>) : null}
  </div>  
);
};

NavSelect.propTypes = {};

NavSelect.defaultProps = {};

export default NavSelect;
