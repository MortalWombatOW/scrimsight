import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import {
//     Nav,
// } from 'react-bootstrap';
import TeamSelect from './TeamSelect/TeamSelect';
import ScrimSelect from './ScrimSelect/ScrimSelect';
// import MapSelect from '../components/MapSelect/MapSelect';
import PlayerSelect from './PlayerSelect/PlayerSelect';
import UserLink from './UserLink/UserLink';

export default (props) => {

    const { brand,id } = props;

    return (
<div className={"NavigationBar"}>
    <span className="scrim">scrim</span>
    <span className="sight">sight</span>
</div>
);



} 