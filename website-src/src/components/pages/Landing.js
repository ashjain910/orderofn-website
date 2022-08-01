import React, { Component, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../../styles/landing.css";
import "../../styles/responsive.css";
import Tab from "react-bootstrap/Tab";
import "font-awesome/css/font-awesome.min.css";
import images from "../common/Images";
import Card from "react-bootstrap/Card";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Modal from "react-bootstrap/Modal";

const handleDragStart = (e) => e.preventDefault();
// Technology Carousel
const items = [
  <img
    src={images.react}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.vue}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.html}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.css}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.ios}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.android}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.azure}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.node}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.redshift}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.docker}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.java}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.ruby}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
  <img
    src={images.mongo}
    onDragStart={handleDragStart}
    className="imgTech"
    alt=""
  />,
];
const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  1024: { items: 4 },
};
// Testimonial Carousel
const itemsCustomers = [
  // Customer1
  <Card className="mt-40 cardCustomers">
    <center>
      <img className="logoClients" src={images.logoCC} alt="Happy customers!" />
    </center>
    <p className="customerPara textCenter clGold">
      Ashish heads up “OrderofN” who have shown themselves to be excellent
      operators and custodians of the ClassCover platform and simply great
      people. If you are looking for a development partner, I cannot recommend
      this team highly enough.
    </p>
    <center>
      <img src={images.quotes} alt="Happy customers!" className="imgQuotes" />
    </center>
    <h4 className="clGold mt-20">BEN GROZIER,</h4>
    <p className="clGold"> CEO</p>
  </Card>,
];
const responsiveCustomers = {
  0: { items: 1 },
  568: { items: 1 },
  1024: { items: 1 },
};

// Our Services Component
function Example() {
  const [swApp, setswApp] = useState(false);
  const [innovativeReality, setinnovativeReality] = useState(false);
  const [AiMl, setAiMl] = useState(false);

  return (
    <>
      <Container fluid id="ourSolutions" className="mt-80">
        <Row>
          <Col sm={12}>
            <h1 className="txtAnton">Our Solutions</h1>
          </Col>
          <Col sm={12}>
            <Row className="mt-40">
              <Col xs={12} sm={12} md={4} lg={4}>
                <div className="flip-card" onClick={() => setswApp(true)}>
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <img
                        src={images.ocab1}
                        alt="Avatar"
                        className="imgCapabilities"
                      />
                      <div className="contentCard">
                        <h1 className="txtAntonSub">Software Applications</h1>
                        <p className="txtGoldSub">
                          Full stack development expertise across various
                          technologies
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {/* <Col xs={12} sm={12} md={6} lg={6}>
                                <div className="flip-card" onClick={() => setiotSol(true)}>
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <img src={images.ocab2} alt="Avatar" className="imgCapabilities" />
                                            <div className="contentCard">
                                                <h1 className="txtAntonSub">IoT Solutions</h1>
                                                <p className="txtGoldSub">Get from idea to value, faster with our design to deploy IoT solutions</p>
                                            </div>
                                        </div>
                                        <div className="flip-card-back">

                                        </div>
                                    </div>
                                </div>
                            </Col> */}
              <Col xs={12} sm={12} md={4} lg={4}>
                <div
                  className="flip-card"
                  onClick={() => setinnovativeReality(true)}
                >
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <img
                        src={images.ocab3}
                        alt="Avatar"
                        className="imgCapabilities"
                      />
                      <div className="contentCard">
                        <h1 className="txtAntonSub">Innovative Reality</h1>
                        <p className="txtGoldSub">
                          Actualize the illusion of any products into your space
                          for you to interact
                        </p>
                      </div>
                    </div>
                    <div className="flip-card-back"></div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={12} md={4} lg={4}>
                <div className="flip-card" onClick={() => setAiMl(true)}>
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <img
                        src={images.ocab4}
                        alt="Avatar"
                        className="imgCapabilities"
                      />
                      <div className="contentCard">
                        <h1 className="txtAntonSub">AI & ML</h1>
                        <p className="txtGoldSub">
                          Make your applications and environment smarter
                        </p>
                      </div>
                    </div>
                    <div className="flip-card-back"></div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      {/* Software Applications */}
      <Modal
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={swApp}
        onHide={() => setswApp(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1 className="txtAntonSub" onClick={() => this.onclickNav}>
              Software Applications
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.ui_ux} className="imgModal" alt="" />
              </center>
              <h4 className="txtCenter">UI / UX design engineering</h4>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.web_and_mobile} className="imgModal" alt="" />
              </center>
              <h4 className="txtCenter">Web and Mobile apps</h4>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                {" "}
                <img src={images.dbm} className="imgModal" alt="imgModal" />
              </center>
              <h4 className="txtCenter">Database management</h4>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.infrastructure} className="imgModal" alt="" />
              </center>
              <h4 className="txtCenter">Infrastructure management</h4>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.devops} className="imgModal" alt="imgModal" />
              </center>
              <h4 className="txtCenter">DevOpsmanagement</h4>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      {/* Innovative Reality */}
      <Modal
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={innovativeReality}
        onHide={() => setinnovativeReality(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1 className="txtAntonSub">Innovative Reality</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.gamification} className="imgModal" alt="" />
              </center>
              <h4 className="txtCenter">Gamification of learning</h4>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.xr} className="imgModal" alt="imgModal" />
              </center>
              <h4 className="txtCenter">Extended Reality</h4>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.digital_twin} className="imgModal" alt="" />
              </center>
              <h4 className="txtCenter">Digital twin</h4>
            </Col>
            {/* <Col xs={12} sm={12} md={3} lg={3}>
                            Grid Four
                        </Col> */}
          </Row>
        </Modal.Body>
      </Modal>
      {/* Ai & Ml */}
      <Modal
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={AiMl}
        onHide={() => setAiMl(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1 className="txtAntonSub">AI & ML</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.vision} className="imgModal" alt="" />
              </center>
              <h4 className="txtCenter">Computer Vision</h4>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.da} className="imgModal" alt="" />
              </center>
              <h4 className="txtCenter">Application Data analytics</h4>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <center>
                <img src={images.actionable} className="imgModal" alt="" />
              </center>
              <h4 className="txtCenter">Actionable Insights</h4>
            </Col>
            {/* <Col xs={12} sm={12} md={3} lg={3}>
                            Grid Four
                        </Col> */}
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default class AboutUs extends Component {
  state = { value: 0, previous: 0 };
  // constructor(props) {
  //     super(props);
  //     this.addFormData = this.addFormData.bind(this);
  // }
  //Form Submission
  // addFormData(evt) {
  //     evt.preventDefault();
  //     const fd = new FormData();
  //     fd.append('name', this.refs.name.value);
  //     fd.append('email', this.refs.email.value);
  //     fd.append('mobile', this.refs.mobile.value);
  //     fd.append('message', this.refs.message.value);
  //     axios.post('http://localhost/reactOrderOfN/test.php', fd
  //     ).then(res => {
  //         //Success alert
  //         Swal.fire({
  //             title: 'Success',
  //             text: res.data.data,
  //             type: 'success',
  //         });
  //         this.myFormRef.reset();
  //     }
  //     );
  // }
  render() {
    return (
      <section id="landing">
        {/* <hr /> */}
        <Container fluid id="aboutUs">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={4} className="sectionAbt">
                <img src={images.aboutBg} className="aboutLeftImg" alt="" />
                <div className="centered txtAnton">About Us</div>
              </Col>
              <Col sm={8}>
                <h1 className="txtAnton mt-80">
                  WE ARE DIGITAL TECHNOLOGY COMPANY
                </h1>
                <p className="trext mt-20">
                  We are idea-driven, working with a strong focus on design and
                  user experience. Inefficient processes, slow delivery, and
                  delivered products that never get used are common frustrations
                  for businesses and IT enterprises. Finding the optimal path to
                  get you from reality to vision is not easy. We are that
                  software delivery partner.
                </p>
                <div className="container">
                  <ul className="timeline">
                    <li>
                      <div className="timeline-badge">
                        <img src={images.first} alt="" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <h4 className="timeline-title txtRight">Sep 2019</h4>
                          {/* <p><small className="text-muted"><i className="glyphicon glyphicon-time"></i> 11 hours ago via Twitter</small></p> */}
                        </div>
                        <div className="timeline-body">
                          <p className="txtRight">
                            Establishment and our first corner table setup.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="timeline-inverted">
                      <div className="timeline-badge">
                        <img src={images.kickoff} alt="" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <h4 className="timeline-title txtLeft">Nov 2019 </h4>
                        </div>
                        <div className="timeline-body">
                          <p className="txtLeft">
                            Our first Co-working space and team formation.
                            <br /> Our first Customer order and project
                            kick-offs.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="timeline-badge">
                        <img src={images.expansion} alt="" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <h4 className="timeline-title txtRight">Feb 2020</h4>
                        </div>
                        <div className="timeline-body">
                          <p className="txtRight">
                            Our project scale up and team expansion.
                            <br />
                            Bigger private office moment.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="timeline-inverted">
                      <div className="timeline-badge">
                        <img src={images.milestone} alt="" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <h4 className="timeline-title txtLeft">Apr 2020</h4>
                        </div>
                        <div className="timeline-body">
                          <p className="txtLeft">
                            Our pilot application go-live.
                            <br />
                            100K user base milestone achieved.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="timeline-badge">
                        <img src={images.innovative} alt="" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <h4 className="timeline-title txtRight">Dec 2020</h4>
                        </div>
                        <div className="timeline-body">
                          <p className="txtRight">
                            Our Research and Innovation division
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
        {/* <hr /> */}
        <Container fluid id="our_services" className="">
          <Container>
            <h1 className="txtAnton clGold fontOurService">Our Services</h1>
            <p className="paraContent clGold">
              We always stay with our clients and respect their business. We
              deliver 100% and provide instant response to help them succeed in
              constantly changing and challenging business world.
            </p>
            <Row>
              {/* <Col xs={12} sm={6} md={4} lg={4}> */}
              <Col xs={12} sm={6} md={4} lg={4} className="svgBox">
                <div className="content">
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <svg id="svgOne" viewBox="0 0 64 64">
                        <g id="Box">
                          <path d="M32,48a1,1,0,0,1-1-1V45a1,1,0,0,1,2,0v2A1,1,0,0,1,32,48Z" />
                          <path d="M55.329,22l6.423-7.341a1,1,0,0,0-.449-1.612l-22-7a1,1,0,0,0-1.055.294L32,13.481l-6.248-7.14A1,1,0,0,0,24.7,6.047l-22,7a1,1,0,0,0-.449,1.612L8.671,22,2.248,29.341A1,1,0,0,0,2.7,30.953L9,32.959V53a1,1,0,0,0,.658.94l22,8a.17.17,0,0,1,.022,0,.942.942,0,0,0,.64,0,.17.17,0,0,1,.022,0l22-8A1,1,0,0,0,55,53V32.959l6.3-2.006a1,1,0,0,0,.449-1.612ZM32,27.95,13.3,22,31,16.368V25a1,1,0,0,0,2,0V16.368L50.7,22Zm7.321-19.8L59.242,14.49l-5.563,6.359L33.758,14.51Zm-14.642,0,5.563,6.359L10.321,20.849,4.758,14.49Zm-14.358,15L30.242,29.49l-5.563,6.359L4.758,29.51ZM53,52.3,33,59.572V51a1,1,0,0,0-2,0v8.572L11,52.3V33.6l13.7,4.358A.983.983,0,0,0,25,38a1,1,0,0,0,.752-.341l5.248-6V41a1,1,0,0,0,2,0V31.661l5.248,6A1,1,0,0,0,39,38a.987.987,0,0,0,.3-.047L53,33.6ZM39.321,35.849,33.758,29.49l19.921-6.339,5.563,6.359Z" />
                        </g>
                      </svg>
                    </Col>
                  </Row>
                  <h1 className="subHeaderLeft clGold">
                    Technology Product <br />
                    Development
                  </h1>
                  <p className="txtCntrt clGold">Craft a product from sketch</p>
                </div>
              </Col>
              <Col xs={12} sm={6} md={4} lg={4} className="svgBox">
                <div className="content">
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <svg id="svgTwo" viewBox="0 0 510.833 510.833">
                        <g>
                          <path d="m255.417 65.563c4.143 0 7.5-3.357 7.5-7.5v-50.563c0-4.143-3.357-7.5-7.5-7.5s-7.5 3.357-7.5 7.5v50.563c0 4.143 3.357 7.5 7.5 7.5z" />
                          <path d="m115.487 119.132c2.93 2.928 7.677 2.928 10.607 0 2.929-2.93 2.929-7.678 0-10.607l-35.754-35.755c-2.929-2.927-7.677-2.929-10.607 0-2.929 2.93-2.929 7.678 0 10.607z" />
                          <path d="m65.027 240.953h-50.564c-4.143 0-7.5 3.357-7.5 7.5s3.357 7.5 7.5 7.5h50.563c4.143 0 7.5-3.357 7.5-7.5s-3.357-7.5-7.499-7.5z" />
                          <path d="m115.487 377.775-35.754 35.754c-2.929 2.93-2.929 7.678 0 10.607 2.93 2.928 7.677 2.928 10.607 0l35.754-35.754c2.929-2.93 2.929-7.678 0-10.607-2.929-2.927-7.677-2.927-10.607 0z" />
                          <path d="m395.346 377.775c-2.93-2.928-7.678-2.928-10.607 0-2.929 2.93-2.929 7.678 0 10.607l35.754 35.754c2.93 2.928 7.677 2.928 10.607 0 2.929-2.93 2.929-7.678 0-10.607z" />
                          <path d="m496.37 240.953h-50.563c-4.143 0-7.5 3.357-7.5 7.5s3.357 7.5 7.5 7.5h50.563c4.143 0 7.5-3.357 7.5-7.5s-3.358-7.5-7.5-7.5z" />
                          <path d="m420.493 72.77-35.754 35.755c-2.929 2.93-2.929 7.678 0 10.607 2.93 2.928 7.677 2.928 10.607 0l35.754-35.755c2.929-2.93 2.929-7.678 0-10.607-2.93-2.928-7.678-2.928-10.607 0z" />
                          <path d="m403.579 233.293c0-82.872-66.465-150.293-148.162-150.293-28.618 0-56.394 8.293-80.324 23.982-23.282 15.265-41.842 36.74-53.673 62.103-1.751 3.754-.127 8.217 3.626 9.968 3.757 1.753 8.217.127 9.968-3.626 21.939-47.035 69.2-77.427 120.403-77.427 73.426 0 133.162 60.692 133.162 135.293 0 35.434-13.39 68.934-37.702 94.327-14.013 14.635-25.941 28.619-29.01 48.213h-130.939c-3.867-20.341-17.742-34.612-30.21-47.425-24.803-25.49-38.463-59.27-38.463-95.115 0-8.851.847-17.703 2.516-26.312.789-4.066-1.868-8.002-5.935-8.791-4.066-.783-8.002 1.869-8.791 5.936-1.852 9.547-2.79 19.36-2.79 29.167 0 39.775 15.169 77.27 42.713 105.576 15.819 16.256 27.017 29.232 27.017 48.251 0 .066.001.134.003.2l.43 44.013c0 14.279 7.617 26.812 19 33.752v8.248c0 20.678 16.822 37.5 37.5 37.5h46c20.678 0 37.5-16.822 37.5-37.5v-8.248c11.383-6.94 19-19.473 19-33.752 0 0-.053-49.026-.153-49.515 1.423-17.382 11.959-29.737 25.447-43.825 26.997-28.199 41.867-65.383 41.867-104.7zm-101.162 240.04c0 12.406-10.094 22.5-22.5 22.5h-46c-12.406 0-22.5-10.094-22.5-22.5v-2.891c1.799.252 3.633.391 5.5.391h80c1.867 0 3.701-.14 5.5-.391zm-5.5-17.5h-80c-13.51 0-24.5-10.99-24.5-24.5v-.5h76c4.143 0 7.5-3.357 7.5-7.5s-3.357-7.5-7.5-7.5h-76v-25h128.768l.232 25h-18c-4.143 0-7.5 3.357-7.5 7.5s3.357 7.5 7.5 7.5h18v.5c0 13.51-10.991 24.5-24.5 24.5z" />
                          <path d="m304.177 234.285c-2.54 3.271-1.947 7.983 1.324 10.523 3.27 2.541 7.982 1.949 10.523-1.324l14.848-19.121c3.932-5.063 5.656-11.354 4.856-17.715-.801-6.361-4.03-12.029-9.094-15.961-5.063-3.932-11.358-5.666-17.715-4.855-6.361.8-12.029 4.029-15.96 9.093l-48.439 62.384-27.8-30.759c-8.875-9.816-24.082-10.582-33.897-1.711-4.756 4.299-7.553 10.192-7.877 16.595-.323 6.402 1.866 12.547 6.164 17.304l47.001 52c9.461 10.974 28.156 10.301 36.761-1.374l29.685-38.23c2.54-3.271 1.947-7.983-1.324-10.523s-7.982-1.949-10.523 1.324l-29.685 38.23c-3.222 4.378-10.253 4.633-13.785.515l-47-52c-3.328-3.682-3.04-9.384.643-12.712 3.68-3.324 9.383-3.04 12.711.643l33.8 37.396c2.946 3.416 8.802 3.22 11.488-.43l53.927-69.451c2.887-3.882 8.873-4.635 12.628-1.589 3.883 2.888 4.635 8.869 1.589 12.629z" />
                        </g>
                      </svg>
                    </Col>
                  </Row>
                  <h1 className="subHeaderLeft clGold">
                    Project Development <br /> Outsourcing
                  </h1>
                  <p className="txtCntrt clGold">Shoulder a project</p>
                </div>
              </Col>
              <Col xs={12} sm={6} md={4} lg={4} className="svgBox">
                <div className="content">
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <svg id="svgThree" viewBox="0 0 512 512">
                        <g>
                          <g>
                            <path d="m474.5 71.5h-26.261c-4.143 0-7.5 3.357-7.5 7.5s3.357 7.5 7.5 7.5h26.261c12.406 0 22.5 10.094 22.5 22.5v34.5h-482v-34.5c0-12.406 10.093-22.5 22.5-22.5h377.809c4.143 0 7.5-3.357 7.5-7.5s-3.357-7.5-7.5-7.5h-377.809c-20.678 0-37.5 16.822-37.5 37.5v82.681c0 4.143 3.358 7.5 7.5 7.5s7.5-3.357 7.5-7.5v-33.181h482v193.366c0 4.143 3.357 7.5 7.5 7.5s7.5-3.357 7.5-7.5v-242.866c0-20.678-16.822-37.5-37.5-37.5z" />
                            <path d="m504.5 375.994c-4.143 0-7.5 3.357-7.5 7.5v19.506c0 12.406-10.094 22.5-22.5 22.5h-437c-12.407 0-22.5-10.094-22.5-22.5v-179.133c0-4.143-3.358-7.5-7.5-7.5s-7.5 3.357-7.5 7.5v179.133c0 20.678 16.822 37.5 37.5 37.5h437c20.678 0 37.5-16.822 37.5-37.5v-19.506c0-4.142-3.357-7.5-7.5-7.5z" />
                            <path d="m108.482 234.457c-2.929-2.928-7.678-2.928-10.606 0l-45.07 45.07c-1.407 1.407-2.197 3.314-2.197 5.304s.79 3.896 2.197 5.304l44.474 44.474c1.464 1.464 3.384 2.196 5.303 2.196s3.839-.732 5.303-2.196c2.929-2.93 2.929-7.678 0-10.607l-39.171-39.17 39.767-39.767c2.93-2.93 2.93-7.678 0-10.608z" />
                            <path d="m209.344 334.608c1.464 1.464 3.384 2.196 5.303 2.196s3.839-.732 5.303-2.196l44.475-44.474c1.406-1.407 2.196-3.314 2.196-5.304s-.79-3.896-2.196-5.304l-45.071-45.07c-2.929-2.928-7.678-2.928-10.606 0-2.929 2.93-2.929 7.678 0 10.607l39.768 39.767-39.171 39.17c-2.93 2.931-2.93 7.679-.001 10.608z" />
                            <path d="m131.99 362.234c3.025 0 5.876-1.844 7.013-4.841l53.294-140.398c1.47-3.873-.478-8.204-4.35-9.674-3.872-1.471-8.204.478-9.673 4.35l-53.294 140.4c-1.47 3.872.478 8.203 4.35 9.673.876.333 1.775.49 2.66.49z" />
                            <path d="m33.006 115.371c0 12.406 10.093 22.5 22.5 22.5s22.5-10.094 22.5-22.5-10.093-22.5-22.5-22.5-22.5 10.094-22.5 22.5zm30 0c0 4.136-3.364 7.5-7.5 7.5s-7.5-3.364-7.5-7.5 3.364-7.5 7.5-7.5 7.5 3.364 7.5 7.5z" />
                            <path d="m91.166 115.371c0 12.406 10.093 22.5 22.5 22.5s22.5-10.094 22.5-22.5-10.093-22.5-22.5-22.5-22.5 10.094-22.5 22.5zm30 0c0 4.136-3.364 7.5-7.5 7.5s-7.5-3.364-7.5-7.5 3.364-7.5 7.5-7.5 7.5 3.364 7.5 7.5z" />
                            <path d="m149.325 115.371c0 12.406 10.093 22.5 22.5 22.5s22.5-10.094 22.5-22.5-10.093-22.5-22.5-22.5-22.5 10.094-22.5 22.5zm30 0c0 4.136-3.364 7.5-7.5 7.5s-7.5-3.364-7.5-7.5 3.364-7.5 7.5-7.5 7.5 3.364 7.5 7.5z" />
                            <path d="m335.5 242.368h47c12.406 0 22.5-10.094 22.5-22.5s-10.094-22.5-22.5-22.5h-47c-12.406 0-22.5 10.094-22.5 22.5s10.094 22.5 22.5 22.5zm0-30h47c4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5h-47c-4.136 0-7.5-3.364-7.5-7.5s3.364-7.5 7.5-7.5z" />
                            <path d="m335.5 302.368h124c12.406 0 22.5-10.094 22.5-22.5s-10.094-22.5-22.5-22.5h-124c-12.406 0-22.5 10.094-22.5 22.5s10.094 22.5 22.5 22.5zm0-30h124c4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5h-124c-4.136 0-7.5-3.364-7.5-7.5s3.364-7.5 7.5-7.5z" />
                            <path d="m335.5 362.368h87.165c12.406 0 22.5-10.094 22.5-22.5s-10.094-22.5-22.5-22.5h-87.165c-12.406 0-22.5 10.094-22.5 22.5s10.094 22.5 22.5 22.5zm0-30h87.165c4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5h-87.165c-4.136 0-7.5-3.364-7.5-7.5s3.364-7.5 7.5-7.5z" />
                          </g>
                        </g>
                      </svg>
                    </Col>
                  </Row>
                  <h1 className="subHeaderLeft clGold">
                    Technology Consulting <br /> & Services
                  </h1>
                  <p className="txtCntrt clGold">Optimize a product</p>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
        {/* <hr className="mt-60" /> */}
        <Example />
        {/* <hr className="mt-60" /> */}
        <Container fluid id="bgGold" className="mt-60">
          <Container>
            <h1 className="txtAnton clGold">Customer Testimonial</h1>
            <AliceCarousel
              disableDotsControls={false}
              autoPlayInterval={8000}
              mouseTracking
              items={itemsCustomers}
              responsive={responsiveCustomers}
              autoPlay
              infinite
            />
          </Container>
        </Container>
        {/* <hr className="mt-60" /> */}
        <Container fluid id="ourTech" className="mt-40">
          <Row>
            <Col xs={12} sm={12} md={4} lg={4}>
              <h1 className="txtAnton mt-60">Our Technologies</h1>
            </Col>
            <Col xs={12} sm={12} md={8} lg={8}>
              <AliceCarousel
                autoPlayInterval={300}
                disableDotsControls={true}
                animationDuration={1000}
                autoPlay
                mouseTracking
                items={items}
                responsive={responsive}
                infinite
              />
            </Col>
          </Row>
        </Container>
        <Container fluid id="ContactForm" className="greyBg mt-40">
          <Row>
            <Col xs={12} sm={12} md={5} lg={5}>
              <img src={images.telephone} className="aboutLeftImg" alt="" />
            </Col>
            {/* <Col xs={12} sm={12} md={1} lg={1}></Col> */}
            <Col xs={12} sm={12} md={7} lg={7} className="contactAddress mt-60">
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <h1 className="txtAnton clGold">Contact Us</h1>
                </Col>
              </Row>
              <Row>
              <Col xs={12} sm={12} md={6} lg={6}>
              <Row className="mt-40">
                <Col xs={2} sm={2} md={2} lg={2}>
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10}>
                  <h5 className="addressDetails">(Chennai)</h5>
                  <p className="addressDetails">
                    40/24, North Road, CIT Nagar West,
                  </p>
                  <p className="addressDetails">
                    CIT Nagar, Chennai, Tamilnadu.
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs={2} sm={2} md={2} lg={2}>
                  <i className="fa fa-phone" aria-hidden="true"></i>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10}>
                  <h5 className="addressDetails fnt-22">+91 98418 49536.</h5>
                </Col>
              </Row>
            </Col>
            
            <Col xs={12} sm={12} md={6} lg={6}>
            <Row className="mt-40">
                <Col xs={2} sm={2} md={2} lg={2}>
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10}>
                  <h5 className="addressDetails">(Australia)</h5>
                  <p className="addressDetails">
                    8-9 Mildred Street, Wentworthville,
                  </p>
                  <p className="addressDetails">NSW 2145.</p>
                </Col>
              </Row>
              <Row>
                <Col xs={2} sm={2} md={2} lg={2}>
                  <i className="fa fa-phone" aria-hidden="true"></i>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10}>
                  <h5 className="addressDetails fnt-22">+ 61 416 353 838.</h5>
                </Col>
              </Row>
            </Col>
            </Row>
              <Row className="mt-40">
                <Col xs={2} sm={2} md={2} lg={2}>
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </Col>
                <Col xs={10} sm={10} md={10} lg={10}>
                  <h5 className="addressDetails fnt-22">
                    marketing@orderofn.com
                  </h5>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}
