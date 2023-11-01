/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import DatePicker from 'react-datepicker';
import {
  Col, Form, Button, Row, Accordion,
} from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import Functions from '../../utils/Functions';
import { ranges } from '../../helpers/DateRanges';

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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
                  {values.active ? 'View Filters' : 'Hide Filters'}
                </Accordion.Toggle>
                <hr className="accordion-hr" />
                <Accordion.Collapse eventKey="0">
                  <div className="form-horizontal">
                    <Form noValidate validated={values.validated}>
                      <Form.Row>
                        <Col xs={12} md={4}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              Status
                            </Form.Label>
                            <Col md="9">
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                as="select"
                                value={values.status}
                                id="status"
                                name="status"
                                onChange={this.props.handleChange}
                              >
                                <option value="" />
                                {values.enumerations
                                  .filter(
                                    (enumeration) => enumeration.key === 'SMSStatus',
                                  )
                                  .map((provider, key) => (
                                    <option key={key} value={provider.value}>
                                      {provider.description}
                                    </option>
                                  ))}
                              </Form.Control>
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              Recipient
                            </Form.Label>
                            <Col md="9">
                              <PhoneInput
                                country="ke"
                                value={values.recipient}
                                inputProps={{
                                  id: 'recipient',
                                  name: 'recipient',
                                }}
                                id="recipient"
                                name="recipient"
                                placeholder="+254700000000"
                                masks={{ ke: '... ... ...' }}
                                onChange={this.props.handlePhone}
                              />
                              <Form.Control.Feedback
                                type="invalid"
                                style={{
                                  display: values.recipient.length > 5
                                  && values.recipient.length < 12
                                    ? 'block'
                                    : 'none',
                                }}
                              >
                                Mobile Number should be 12 digits in length
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              Range
                            </Form.Label>
                            <Col md="9">
                              <Form.Control
                                autoComplete="off"
                                type="text"
                                as="select"
                                value={values.dateRange}
                                id="dateRange"
                                name="dateRange"
                                disabled={values.year !== '' || values.month !== '' || values.date !== ''}
                                onChange={this.props.handleChange}
                              >
                                <option value="" />
                                {ranges.map((range, key) => (
                                  <option key={key} value={range}>
                                    {range}
                                  </option>
                                ))}
                              </Form.Control>
                            </Col>
                          </Form.Group>
                        </Col>
                      </Form.Row>
                      <Form.Row>

                        <Col xs={12} md={4}>
                          <Form.Group as={Row}>
                            <Form.Label column md="3">
                              Start Date
                            </Form.Label>
                            <Col md="9">
                              <DatePicker
                                id="startDate"
                                name="startDate"
                                selected={Date.parse(values.startDate)}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => this.props.setDate(date, 'startDate')}
                                maxDate={new Date()}
                                // showYearPicker
                                disabled={values.dateRange !== 'Custom Range'}
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
                              End Date
                            </Form.Label>
                            <Col md="9">
                              <DatePicker
                                id="endDate"
                                name="endDate"
                                selected={Date.parse(values.endDate)}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => this.props.setDate(date, 'endDate')}
                                maxDate={new Date()}
                                minDate={values.startDate}
                                isClearable
                                disabled={values.dateRange !== 'Custom Range'}
                                dropdownMode="select"
                                onFocus={this.function.handleFocus}
                                className="form-control"
                              />
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={4} />
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

export default Filters;
