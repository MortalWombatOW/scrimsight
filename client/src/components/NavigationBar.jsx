import React from 'react'
import {
    Navbar,
    Nav,
    NavItem,
    NavDropdown,
    MenuItem,    
    Button
} from 'react-bootstrap'
import '../css/navigationBar.css'

export default (props) => {

    const { brand,id } = props;

    return <Navbar id={id} inverse collapseOnSelect className="navbar-fixed-top">
    <Navbar.Header>
        <Navbar.Brand>
            <span className="scrim">scrim</span>
            <span className="sight">sight</span>
        </Navbar.Brand>
        <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
        <Nav pullRight>
            <NavItem eventKey={1} href="/">
                Home
      </NavItem>
      <NavItem eventKey={2} href="/map">
                Maps
      </NavItem>
        <NavItem eventKey={23} href="/upload">
                Upload Map
      </NavItem>
        </Nav>
    </Navbar.Collapse>
</Navbar>



} 