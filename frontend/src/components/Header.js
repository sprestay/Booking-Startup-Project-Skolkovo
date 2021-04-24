import React from "react";
import { Button, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { ReactComponent as Logo } from "../logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import cat_image from '../images/on_create_book.png';


const Header = () => {
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" style={{backgroundColor: "#FFD90F"}}> {/* bg="dark" variant="dark" */}
            <Navbar.Brand href="/">
                {/* <Logo
                alt=""
                width="30"
                height="30"
                className="d-inline-block align-top"
                /> */}
                <img src={cat_image} style={{height: "30px", marginRight: "15px", fontWeight: 'bold'}} />
                SK BOOKS
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>
                    <Nav.Link href="/" style={{fontWeight: 'bold'}}>Главная</Nav.Link>
                    <Nav.Link eventKey={2} href="/generate" style={{fontWeight: 'bold'}}>Создать QR</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        </div>
    );
}


export default Header;