/* eslint-disable comma-spacing */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Breadcrumb, Col, Form, Button, Row,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';
import Functions from '../../../utils/Functions';
import Services from '../../../utils/Services';
import Navigation from '../../../components/Navigation/Navigation';
import Footer from '../../../components/Common/Footer';
import AlertDisplay from '../../../components/Common/Alert';

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sideMenu: true,
      enumerations: [],
      firstName: '',
      lastName: '',
      gender: '',
      age: '',
      town: '',
      // eslint-disable-next-line react/no-unused-state
      candidateId: window.location.href.split('/').pop(),
    };
    this.function = new Functions(this);
    this.services = new Services(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const id = window.location.href.split('/').pop();
    const disable = window.location.href.split('/')[4].split('-')[0] !== 'create';
    if (disable) {
      this.services.getCandidate(id);
    }
    this.services.getEnumerations();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleSubmit = (event, fields, special) => {
    window.scrollTo(0, 0);

    if (this.function.checkEmpty(fields)) {
      return;
    }

    this.submitForm();
  };

  submitForm = () => {
    const data = {
      firstName: this.state.firstName.toLocaleUpperCase(),
      lastName: this.state.lastName.toLocaleUpperCase(),
      age: this.state.age,
      town: this.state.town,
      gender: this.state.gender,
    };

    const disable = window.location.href.split('/')[4].split('-')[0] !== 'create';

    const action = disable ? 'put' : 'post';
    this.services.submitAction(data, 'users', action);
  };

  render() {
    const disable = window.location.href.split('/')[4].split('-')[0] !== 'create';
    const requiredFields = parseInt(this.state.userType, 10) === 10 ? [
      'firstName',
      'lastName',
      'contactEmail',
      'contactMobile',
      'roleId',
      'regionId',
      'userType',
    ] : [
      'firstName',
      'lastName',
      'contactEmail',
      'contactMobile',
      'roleId',
      'branchId',
      'userType',
    ];
    return (
      <div className="page-wrapper">
        <Navigation onClick={this.function._onSideMenu} />
        <div
          className={`main-content d-flex flex-column ${
            this.state.sideMenu ? '' : 'hide-sidemenu'
          }`}
        >
          <div className="main-content-header">
            <Breadcrumb>
              <Link to="/" className="breadcrumb-item">
                Candidates
              </Link>
              <Breadcrumb.Item active>
                {disable ? 'Edit Candidate' : 'Register Candidate'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {this.state.error || this.state.success ? (
            <AlertDisplay
              error={this.state.error}
              success={this.state.success}
              successMessage={this.state.successMessage}
              errorMessage={this.state.errorMessage}
              closeAlert={this.function.closeAlert}
            />
          ) : (
            ''
          )}
          <div className="row">
            <div className="col-lg-12">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="panel-body">
                    <Form noValidate validated={this.state.validated}>
                      <Form.Row>
                        <Col xs={12} md={6}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              First Name
                            </Form.Label>
                            <Col md="9">
                              <Form.Control
                                autoComplete="off"
                                required
                                type="text"
                                value={this.state.firstName}
                                id="firstName"
                                name="firstName"
                                onChange={this.function.handleChange}
                                isValid={this.state.firstName !== ''}
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              Last Name
                            </Form.Label>
                            <Col md="9">
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                value={this.state.lastName}
                                id="lastName"
                                name="lastName"
                                onChange={this.function.handleChange}
                                isValid={this.state.lastName !== ''}
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col xs={12} md={6}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              Gender
                            </Form.Label>
                            <Col md="9">
                              <Form.Control
                                autoComplete="off"
                                required
                                type="text"
                                as="select"
                                value={this.state.gender}
                                id="gender"
                                name="gender"
                                onChange={this.function.handleChange}
                                isValid={this.state.gender !== ''}
                              >
                                <option value="" />
                                {this.state.enumerations.filter((enumeration) => enumeration.key === 'Gender').map((gender) => (
                                  <option value={gender.value}>
                                    {gender.description}
                                  </option>
                                ))}
                              </Form.Control>
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              Town
                            </Form.Label>
                            <Col md="9">
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                value={this.state.town}
                                id="town"
                                name="town"
                                onChange={this.function.handleChange}
                                isValid={this.state.town !== ''}
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col xs={12} md={6}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              Age
                            </Form.Label>
                            <Col md="9">
                              <CurrencyFormat
                                autoComplete="off"
                                required
                                thousandSeparator
                                type="text"
                                id="age"
                                name="age"
                                className="form-control"
                                onChange={this.function.handleChange}
                                value={this.state.age}
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </Form>
                    <hr className="footer-hr" />
                    <div className="panel-footer">
                      <div className="btn-group">
                        <span>
                          <Link
                            to="/"
                            className=" btn btn-xs btn-secondary"
                          >
                            Back to List
                          </Link>
                        </span>
                      </div>
                      <div className="btn-group pull-right">
                        <span>
                          <Button
                            type="submit"
                            variant="success"
                            size="xs"
                            onClick={(e) => this.handleSubmit(
                              e,
                              requiredFields,
                              'updateUser',
                            )}
                          >
                            {disable ? 'Update' : 'Save'}
                          </Button>
                        </span>
                        &nbsp;
                        <span>
                          <Button
                            type="submit"
                            variant="danger"
                            size="xs"
                            onClick={this.function.handleCancel}
                          >
                            Cancel
                          </Button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex-grow-1" />
          <Footer />
          {/* End Footer */}
        </div>
      </div>
    );
  }
}

export default AddUser;
