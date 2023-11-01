/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import DatePicker from 'react-datepicker';
import {
  Col, Form, Button, Row, Accordion,
} from 'react-bootstrap';
import Services from '../../utils/Services';
import Functions from '../../utils/Functions';

class PTPDateFilter extends React.Component {
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
                      ? 'btn btn-xs btn-success'
                      : 'btn btn-xs btn-secondary'
                  }
                  eventKey="0"
                  onClick={this.props.toggleClass}
                >
                  {values.active ? 'Hide Filters' : 'View Filters'}
                </Accordion.Toggle>
                <hr className="accordion-hr" />
                <Accordion.Collapse eventKey="0">
                  <div className="form-horizontal">
                    <Form noValidate validated={values.validated}>
                      <Form.Row>
                        <Col xs={12} md={4}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              From
                            </Form.Label>
                            <Col md="9">
                              <DatePicker
                                id="startDate"
                                name="startDate"
                                selected={Date.parse(values.startDate)}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => this.props.setDate(date, 'startDate')}
                                // showYearPicker
                                dropdownMode="select"
                                isClearable
                                onFocus={this.function.handleFocus}
                                className="form-control"
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              To
                            </Form.Label>
                            <Col md="9">
                              <DatePicker
                                id="endDate"
                                name="endDate"
                                selected={Date.parse(values.endDate)}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => this.props.setDate(date, 'endDate')}
                                minDate={values.startDate}
                                isClearable
                                dropdownMode="select"
                                onFocus={this.function.handleFocus}
                                className="form-control"
                              />
                            </Col>
                          </Form.Group>
                        </Col>
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

export default PTPDateFilter;
