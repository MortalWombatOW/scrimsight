import React from 'react'
import { Col, Row, Container, Card, Button, Badge} from 'react-bootstrap';
import '../css/home.css'
import Block from './Block/Block';
export default (props) => {
    const { id } = props;
    return (<div>
		<div className="splash">
			<div className="logo">
				<div className="logo-top">
					<span className="scrim">scrim</span>
            		<span className="sight">sight</span>
					<span className="badge status-badge">alpha</span>
				</div>
				<div className="logo-bottom">
					Overwatch Scrim Analytics Platform
				</div>
			</div>
		</div>
		<Container>
			<Row>
				<Col md={4}>
					<Block title="Use Code G3H7FF in Scrim"></Block>
				</Col>
				<Col md={4}><Block title="Upload Map Logs"></Block></Col>
				<Col md={4}><Block title="View Reports"></Block></Col>
			</Row>
		</Container>
		</div>);
	
}