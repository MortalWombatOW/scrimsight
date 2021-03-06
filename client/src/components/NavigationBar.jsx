import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import {
//     Nav,
// } from 'react-bootstrap';
import '../css/navigationBar.css'
import TeamSelect from '../components/TeamSelect/TeamSelect';
import ScrimSelect from '../components/ScrimSelect/ScrimSelect';
import MapSelect from '../components/MapSelect/MapSelect';
import PlayerSelect from '../components/PlayerSelect/PlayerSelect';
import UserLink from '../components/UserLink/UserLink';

export default (props) => {

    const { brand,id } = props;

    return (
<Container className={"NavigationBar"}>
    <Row>
        {/* <Col md={4}><span className='scrim' >scrim</span><span className='sight' >sight</span></Col>
        <Col md={4}><center>
            {[['Home', ''], ['Maps','map'], ["Upload", 'upload']].map(x=><Link className="navlink" key={x[1]} to={'/'+x[1]}>{x[0]}</Link>)}
            
            </center></Col>
        <Col md={4} className="right">Team Name <div className="avatar"></div></Col> */}
        <Col md={5}>
            <TeamSelect></TeamSelect>
        </Col>
        <Col md={5}>
            <ScrimSelect></ScrimSelect>
        </Col>
        <Col md={2} className="right">
            <UserLink></UserLink>
        </Col>
    </Row>
    <Row>
        <Col md={5}>
            <MapSelect></MapSelect>
        </Col>
        <Col md={5}>
            <PlayerSelect></PlayerSelect>
        </Col>
        <Col md={2} className="right">
           
        </Col>
    </Row>
</Container>

//     <Navbar id={id} inverse collapseOnSelect className="navbar-fixed-top">
//     <Navbar.Header>
//         <Navbar.Brand>
//             <span className="scrim">scrim</span>
//             <span className="sight">sight</span>
//         </Navbar.Brand>
//         <Navbar.Toggle />
//     </Navbar.Header>
//     <Navbar.Collapse>
//         <Nav pullRight>
//             <NavItem eventKey={1} href="/">
//                 Home
//       </NavItem>
//       <NavItem eventKey={2} href="/map">
//                 Maps
//       </NavItem>
//         <NavItem eventKey={23} href="/upload">
//                 Upload Map
//       </NavItem>
//         </Nav>
//     </Navbar.Collapse>
// </Navbar>
);



} 