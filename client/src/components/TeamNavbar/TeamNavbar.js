import React from 'react';
import PropTypes from 'prop-types';
import './TeamNavbar.css';
import '../../css/navigationBar.css'
import { Col, Container, Row } from 'react-bootstrap';
import TeamSelect from '../TeamSelect/TeamSelect';
import UserLink from '../UserLink/UserLink';

const TeamNavbar = () => {
    return (
        <Container className={"NavigationBar"}>
            <Row>
                <Col md={9}>
                    <TeamSelect></TeamSelect>
                </Col>
                <Col md={3} className="right">
                    <UserLink></UserLink>
                </Col>
            </Row>
        </Container>
    );
};

TeamNavbar.propTypes = {};

TeamNavbar.defaultProps = {};

export default TeamNavbar;
