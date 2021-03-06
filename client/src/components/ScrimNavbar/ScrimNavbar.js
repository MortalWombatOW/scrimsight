import React from 'react';
import PropTypes from 'prop-types';
import './ScrimNavbar.css';
import '../../css/navigationBar.css'
import { Col, Container, Row } from 'react-bootstrap';
import TeamSelect from '../TeamSelect/TeamSelect';
import UserLink from '../UserLink/UserLink';
import ScrimSelect from '../ScrimSelect/ScrimSelect';

const ScrimNavbar = () => (
  <Container className={"NavigationBar"}>
    <Row>
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
  </Container>
);

ScrimNavbar.propTypes = {};

ScrimNavbar.defaultProps = {};

export default ScrimNavbar;
