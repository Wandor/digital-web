/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import {withRouter } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import * as Icon from 'react-feather';
import './SideMenu.css';

class SideMenuLight extends React.Component {
  render() {
    const { handleMenu } = this.props;
    return (
      <div
        className={`sidemenu-area sidemenu-light ${
          this.props.sideMenu ? 'sidemenu-toggle' : ''
        }`}
      >
        <Navbar
          className={`sidemenu ${this.props.sideMenu ? 'hide-nav-title' : ''}`}
        >
          <Navbar.Collapse>
            <Nav>
              <Nav.Link onClick={(e) => handleMenu(e, 'dashboard')}>
                <div className="dropdown-title">
                  <Icon.PieChart className="icon" />
                  <span className="title">
                    Candidates
                    <Icon.ChevronDown className="icon fr" />
                  </span>
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(SideMenuLight);
