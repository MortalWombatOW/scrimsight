import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import {
//     Nav,
// } from 'react-bootstrap';
import '../css/navigationBar.css'

export default (props) => {

    const { brand,id } = props;

    return (
<Container className={"NavigationBar"}>
    <Row>
        <Col md={4}><span className='scrim' >scrim</span><span className='sight' >sight</span></Col>
        <Col md={4}><center>
            {[['Home', ''], ['Maps','map'], ["Upload", 'upload']].map(x=><Link className="navlink" key={x[1]} to={'/'+x[1]}>{x[0]}</Link>)}
            
            </center></Col>
        <Col md={4} className="right">Team Name <div className="avatar"></div></Col>
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