import React from "react";
import { Button, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { ReactComponent as Logo } from "../logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";


const Header = () => {
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">
                <Logo
                alt=""
                width="30"
                height="30"
                className="d-inline-block align-top"
                />
                Book Sharing
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>
                    <Nav.Link href="/">Главная</Nav.Link>
                    <Nav.Link eventKey={2} href="/generate">Создать QR</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        </div>
    );
}


export default Header;