/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import {
  Col, Form, Button, Row, Accordion,
} from 'react-bootstrap';
import Services from '../../utils/Services';
import Functions from '../../utils/Functions';

class ROAllocationFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.services = new Services(this);
    this.function = new Functions(this);
  }

  render() {
    const { values } = this.props;
    return (
      <Row>
        <Col lg={12}>
          <div className="card mb-4" id="sales">
            <div className="card-body">
              <Accordion eventKey="0">
                <Accordion.Toggle
                  as={Button}
                  variant={
                    values.active
                      ? 'btn btn-xs btn-secondary'
                      : 'btn btn-xs btn-success'
                  }
                  eventKey="0"
                  onClick={this.props.toggleClass}
                >
                  {values.active ? 'Hide Filters' : 'View Filters'}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <div className="form-horizontal">
                    <Form noValidate validated={values.validated}>
                      <Form.Row>
                        <Col xs={12} md={4}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              Branch
                            </Form.Label>
                            <Col md="9">
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                as="select"
                                value={values.filterBranchId}
                                id="filterBranchId"
                                name="filterBranchId"
                                disabled
                                onChange={this.props.handleChange}
                              >
                                <option value="" />
                                {values.companyBranches
                                  .map((branch, key) => (
                                    <option key={key} value={branch.id}>
                                      {branch.name}
                                    </option>
                                  ))}
                              </Form.Control>
                            </Col>
                          </Form.Group>
                        </Col>
                        {values.filterBranchId === '' ? (
                          ''
                        ) : (
                          <Col xs={12} md={4}>
                            <Form.Group as={Row}>
                              <Form.Label column md="3">
                                RO
                              </Form.Label>
                              <Col md="9">
                                <Form.Control
                                  autoComplete="off"
                                  type="text"
                                  as="select"
                                  value={values.roId}
                                  id="roId"
                                  name="roId"
                                  onChange={this.props.handleChange}
                                >
                                  <option value="" />
                                  {values.companyRelationshipOfficers
                                    // eslint-disable-next-line max-len
                                    .filter((loanofficer) => loanofficer.branchId === values.filterBranchId)
                                    .map((ro, key) => (
                                      <option key={key} value={ro.id}>
                                        {ro.firstName}
                                        {' '}
                                        {ro.lastName}
                                      </option>
                                    ))}
                                </Form.Control>
                              </Col>
                            </Form.Group>
                          </Col>
                        )}
                      </Form.Row>
                    </Form>
                    <hr className="footer-hr" />
                    <div className="panel-footer">
                      <div className="btn-group pull-right">
                        <span>
                          <Button
                            type="submit"
                            variant="outline-success"
                            size="xs"
                            onClick={this.props.handleApply}
                          >
                            Apply
                          </Button>
                        </span>
                        &nbsp;
                        <span>
                          <Button
                            type="submit"
                            variant="outline-danger"
                            size="xs"
                            onClick={this.props.handleClear}
                          >
                            Clear
                          </Button>
                        </span>
                      </div>
                    </div>
                  </div>
                </Accordion.Collapse>
              </Accordion>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default ROAllocationFilter;
