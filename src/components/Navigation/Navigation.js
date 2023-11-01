/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
import React from 'react';
import moment from 'moment';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import * as Icon from 'react-feather';
import './Navigation.css';
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Image,
} from 'react-bootstrap';
import SideMenuLight from './SideMenu/SideMenuLight';
import Logo from '../../assets/img/Rahisi-DFA-Logo-300x100 (1).png';
import SmallLogo from '../../assets/img/Rahisi-DFA-icon-100x100_1_32x32.png';
import profile from '../../assets/img/empty_profile.jpg';
import Services from '../../utils/Services';
import Functions from '../../utils/Functions';
// import * as serviceWorker from '../../serviceWorker';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideMenu: false,
      term: '',
      menuColor: true,
      supportCompany: [sessionStorage.getItem('companyId'), sessionStorage.getItem('coreDB'), sessionStorage.getItem('authDB')],
      supportCompanies: JSON.parse(sessionStorage.getItem('supportCompanies')),
      notifications: JSON.parse(localStorage.getItem('notifications')),
    };
    this.services = new Services(this);
    this.function = new Functions(this);
  }

  componentDidMount() {
    // serviceWorker.getNotifications();
  }

  _toggleClass = () => {
    const currentSideMenu = this.state.sideMenu;
    this.setState({ sideMenu: !currentSideMenu });
    this.props.onClick(this.state.sideMenu);
  };

  handleDelete = (event, data) => {
    event.preventDefault();
    const { notifications } = this.state;
    const i = notifications.indexOf(data);
    notifications.splice(i, 1);

    let url;

    this.setState({
      notifications,
    });

    localStorage.setItem('notifications', JSON.stringify(notifications));

    switch (data.title) {
      case 'Customer Approvals':
        url = '/app/customers-approvals';
        break;
      case 'Customer Branch Approvals':
        url = '/app/customers-approvals';
        break;
      case 'Limit Approvals':
        url = '/app/limit-histories';
        break;
      case 'Lock Approvals':
        url = '/app/lock-histories';
        break;
      case 'Approved Leads':
        url = '/app/marketing-leads';
        break;
      default:
        break;
    }

    this.props.history.push(url);
  };

  render() {
    let notifications;
    const seen = new Set();
    const companyNotifications = this.state.notifications !== undefined && this.state.notifications !== null ? this.state.notifications.filter((notif) => notif.companyId === sessionStorage.getItem('companyId')) : [];
    const result = companyNotifications.filter((el) => {
      const duplicate = seen.has(el.body);
      seen.add(el.body);
      return !duplicate;
    });

    switch (parseInt(sessionStorage.getItem('userType'), 10)) {
      case 3:
        notifications = result.filter((item) => item.userType === 3);
        break;
      case 8:
        notifications = result.filter((item) => item.userType === 3);
        break;
      case 5:
        notifications = result.filter((item) => item.userType === 5 && (item.branchId === sessionStorage.getItem('defaultBranch') || item.branchId === sessionStorage.getItem('hostBranchId')));
        break;
      case 7:
        notifications = result.filter((item) => item.userType === 7 && (item.userId === sessionStorage.getItem('userId') || item.userId === sessionStorage.getItem('relationshipOfficerId')));
        break;
      case 2:
        notifications = result.filter((item) => item.userType === 2 && item.userId === sessionStorage.getItem('userId'));
        break;

      default:
        break;
    }

    return (
      <div className="page-wrapper">
        <Navbar fixed="top" className="top-menu">
          <Link
            to="#"
            className={`navbar-brand ${
              this.state.sideMenu ? 'navbar-logo' : ''
            }`}
          >
            {/* Large logo */}
            <Image
              src={Logo}
              alt="Logo"
              className="large-logo mw-170"
              style={{ maxWidth: '170%' }}
            />
            {/* Small logo */}
            <Image
              src={SmallLogo}
              alt="Small Logo"
              className="small-logo"
              style={{ maxWidth: '100%' }}
            />
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Burger menu */}
          <div
            className={`burger-menu ${
              this.state.sideMenu ? 'toggle-menu' : ''
            }`}
            onClick={this._toggleClass}
          >
            <span className="top-bar" />
            <span className="middle-bar" />
            <span className="bottom-bar" />
          </div>
          {/* End Burger menu */}

          <Navbar.Collapse id="basic-navbar-nav">
            {parseInt(sessionStorage.getItem('userType'), 10) === 1 ? (
              <Form
                className="nav-search-form d-none d-sm-block"
              >
                <FormControl
                  type="text"
                  id="supportCompany"
                  as="select"
                  name="supportCompany"
                  value={this.state.supportCompany}
                  onChange={this.function.handleChange}
                >
                  <option value="" />
                  {this.state.supportCompanies.map(
                    (company, key) => {
                      const selected = [
                        company.id,
                        company.coreDatabaseName,
                        company.authDatabaseName,
                      ];
                      return (
                        <option key={key} value={selected}>
                          {company.CompanyName}
                        </option>
                      );
                    },
                  )}

                </FormControl>
              </Form>
            ) : (
              ''
            )}
            <Nav className="ml-auto right-nav">
              <NavDropdown
                title={(
                  <div className="count-info">
                    <Icon.Bell className="icon" />
                    {companyNotifications && companyNotifications.length > 0 ? (
                      <span className="ci-number">
                        <span className="ripple" />
                        <span className="ripple" />
                        <span className="ripple" />
                      </span>
                    ) : ''}

                  </div>
                )}
                id="basic-nav-dropdown"
                className="message-box"
              >
                {this.state.notifications && this.state.notifications.sort((a, b) => b.timestamp - a.timestamp).map(
                  (notification, key) => (
                    <NavLink to="#" className="dropdown-item" key={key} onClick={(e) => this.handleDelete(e, notification)}>
                      <div className="message-item">
                        <span className="chat-content">
                          <h5 className="message-title">{notification.title}</h5>
                          <span className="mail-desc">
                            {notification.body}
                          </span>
                        </span>
                        <span className="time">{notification.timestamp === 0 ? moment(new Date()).format('DD-MMM-YYYY hh:mm a') : moment(notification.timestamp).format('DD-MMM-YYYY hh:mm a')}</span>
                      </div>
                    </NavLink>
                  ),
                )}
              </NavDropdown>

              <NavDropdown
                title={(
                  <div className="menu-profile">
                    <span className="name">
                      {sessionStorage.getItem('userName')}
                    </span>
                    <Image src={profile} alt="Profile Image" roundedCircle />
                  </div>
                )}
                id="basic-nav-dropdown"
                className="profile-nav-item"
              >
                <NavLink
                  to="#"
                  className="dropdown-item"
                  onClick={() => this.services.signOut()}
                >
                  <Icon.LogOut className="icon" />
                  Logout
                </NavLink>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <SideMenuLight
          sideMenu={this.state.sideMenu}
          handleMenu={this.function.handleMenu}
          values={this.state}
        />
      </div>
    );
  }
}

export default withRouter(Navigation);
