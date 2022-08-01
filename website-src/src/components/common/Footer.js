import React,{Component} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import images from '../common/Images';

export default class Footer extends Component{
    render(){
        return(
            <div className="">  
            
                <Container fluid>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} id="copyrights">
                            <center><p className="crFooter">Copyrights © 2022 OrderOfN</p></center>
                        </Col>
                    </Row>
                </Container>
        </div>
        )
    }
}