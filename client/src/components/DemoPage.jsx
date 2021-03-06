import React from 'react'
import { Col, Row, Container, Card, Button, Badge} from 'react-bootstrap';
import '../css/home.css'
import Block from './Block/Block';
import UserLink from './UserLink/UserLink';
import dva from '../img/fullpage/dva.jfif';
import cree from '../img/fullpage/cree.jfif'
export default (props) => {
    const { id } = props;

	const cta = localStorage.getItem('userid') == null ? (
		<Row>
			<Col md={12} className="cta">
				<UserLink>Connect with Discord and power up your team</UserLink>
			</Col>
		</Row>
	) : (<Row>
		<Col md={12} className="cta">
		<UserLink>Continue as {localStorage.getItem('username')}</UserLink>
		</Col>
	</Row>);
    return (<div>
		<div className="splash">
			<div className="logo">
				<div className="logo-top">
					<span className="scrim">scrim</span>
            		<span className="sight">sight</span>
					<span className="badge status-badge">v0.1</span>
				</div>
				<div className="logo-bottom">
					Overwatch Scrim Analytics Platform
				</div>
			</div>
		</div>
		<Container className="nudge1">
			{cta}
			<Row>
				<Col md={2}>
					<div className="number">1</div>
				</Col>
				<Col md={6}>
					<div className="item">Use Code G3H7FF in Scrims</div><br/>
					<div className="desc">We've extended the workshop mode you already use to log data from each map to your computer.</div>
				</Col>
			</Row>
			<Row>
			<Col md={2}>
					<div className="number">2</div>
				</Col>
				<Col md={6}>
					<div className="item">Upload Map Logs</div><br/>
					<div className="desc">After the scrim, upload your files to scrimsight for processing.</div>
				</Col>
			</Row>
			<Row>
			<Col md={2}>
					<div className="number">3</div>
				</Col>
				<Col md={7}>
					<div className="item">View and share insights</div><br/>
					<div className="desc">Build customizeable dashboards and share them with your teammates.</div>
					</Col>
			</Row>
			
			{/* <Row>
			<Col md={2}></Col>
				<Col md={8}>
					<a className="getstarted" href="/teams">Take your team to the next level</a>
					</Col>
			<Col md={2}></Col>
			</Row>
			<Row>
			<Col md={2}>
					<div className="header">About</div>
				</Col>
				<Col md={10}>
					<div className="about_img">
						<img src
						Built by Andrew Gleeson
					</div>
					<div className="about">Hey, I'm Andrew! I'm a main tank player and software engineer who built this after being frustrated by the very manual process of VOD review.</div>
				</Col>
			</Row> */}
		</Container>
		<img src={dva} className="img1"></img>
		<img src={cree} className="img2"></img>
		</div>);
	
}