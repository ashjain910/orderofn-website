import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
// import WaveAnim from './WaveAnim';
import '../../styles/global.css';
import '../../styles/header.css';
import images from '../common/Images';
import AnchorLink from 'react-anchor-link-smooth-scroll'
import Typed from 'react-typed';
// import Col from 'react-bootstrap/Col'
// import Particles from 'react-particles-js';


export default class Common_Template extends Component {
    state = {
        className: "testScroll",
        imgLogoHeader: images.logo_white,
        menuColor: "nav-link",
        logoHeader: "logoHeadertran",
        collapseMenu: ""
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (window.scrollY === 0) {
            this.setState({
                className: "testScroll",
                menuColor: "nav-link",
                imgLogoHeader: images.logo_white,
                logoHeader: "logoHeadertran",                
            });
        }
        else if (window.scrollY !== 0) {
            this.setState({
                className: "blue",
                imgLogoHeader: images.logo_blue,
                menuColor: "clrBlue",
                logoHeader: "logoHeaderWhite",
                collapseMenu: "navbar-collapse collapse hide"
            });
        }

    }

    // handleClick(collapseMenu){         
    //     this.setState({
    //         collapseMenu: "navbar-collapse collapse hide",
    //     });
    //   } 

    render() {
        return (
            <section id="header">
                <Navbar className={this.state.className} collapseOnSelect expand="lg" bg="dark" variant="dark" id="fixedHeader">
                    <Navbar.Brand href="/">
                        <img src={this.state.imgLogoHeader} alt="OrderOfn Logo" className={this.state.logoHeader} />
                    </Navbar.Brand>
                    <Navbar.Toggle> 
                    <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                    </Navbar.Toggle>
                    <Navbar.Collapse id="responsive-navbar-nav" className={this.state.collapseMenu}>
                        <Nav className="ml-auto background menuColor">
                            {/* activeLink */}
                            <AnchorLink offset='80' href='#header' className={this.state.menuColor}>Home</AnchorLink>
                            <AnchorLink offset='80' href='#landing' className={this.state.menuColor}>About</AnchorLink>
                            <AnchorLink offset='80'  href='#our_services' className={this.state.menuColor}>Services</AnchorLink>
                            <AnchorLink offset='120' href='#ourSolutions' className={this.state.menuColor}>Solutions</AnchorLink>
                            <AnchorLink offset='40' href='#ContactForm' className={this.state.menuColor}>Contact Us</AnchorLink>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Container fluid id="GradientSec">
                    <Row>
                        <div className="bg-video-wrap">
                            <video src={images.landingVideo1} loop muted autoPlay>
                                <source src={images.landingVideo1} type="video/mp4" />
                            </video>
                            <div className="OverLaytxt">
                                <Typed strings={[
                                    "<span style='font-size:24px;'>We combine design, thinking and technical craft </span><br /><span class='testDatatata'>CREATIVE THINKER</span>",
                                    "<span style='font-size:24px;'>We combine agile, lean and product craft </span><br /><span class='testDatatata'>INNOVATIVE DESIGNER</span>",
                                    "<span style='font-size:24px;'>We combine business, challenges and technology craft </span></br /><span class='testDatatata'>INGENIOUS SOLUTION</span>"
                                ]}
                                    typeSpeed={75}
                                    backSpeed={30}
                                    startDelay={30}
                                    loop

                                />
                            </div>
                        </div>
                    </Row>
                </Container>
                {/* <h3 className="casCadeStyle">casCadeStyle</h3> */}
            </section>
        )
    }
}


// <span class="numberOrder">5</span><span class="blue">let</span> <span class="pink">developer</span> = <span class="orange">await peerbits.skills.hire({</span> <br />
// <span class="numberOrder">6</span><span class="orange">Experience:</span> <span class="orangeDark">10+ years</span><br />
// <span class="numberOrder">7</span><span class="orange">Technologies:</span> <span class="orangeDark">React.JS, Angular, Node.JS, .net</span><br />
// <span class="numberOrder">8</span>});<br />
// <span class="numberOrder">9</span><br />
// <span class="numberOrder">10</span><span class="pink">while</span>(<span class="pink">development!</span>= <span class="orange">Done</span>)<br />
// <span class="numberOrder">11</span><span class="orange">develop();</span><br />
// <span class="numberOrder">12</span><span class="pink">if</span>(<span class="blue">result</span>==<span class="orangeDark">Client’s approval)</span><br />
// <span class="numberOrder">13</span><span class="blue">console</span>.<span class="pink">log</span>(<span class="orangeDark">“Project Completion“</span>);<br />
// <span class="numberOrder">14</span><span class="pink">else</span><br />
// <span class="numberOrder">15</span><span class="pink">Redevelopment</span>();<br />
// <span class="numberOrder">16</span><br />
// <span class="numberOrder">17</span><span class="pink">return</span> <span class="orange">support</span>;<br />

