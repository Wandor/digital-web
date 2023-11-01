/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import DatePicker from 'react-datepicker';
import {
  Col, Form, Button, Row, Accordion,
} from 'react-bootstrap';
import Functions from '../../utils/Functions';
import { ranges } from '../../helpers/DateRanges';

class ReportFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.function = new Functions(this);
  }

  render() {
    const { values } = this.props;
    const params = values.reportParams.filter((param) => param.display && param.parameterUsers.includes(parseInt(sessionStorage.getItem('userType'))));

    const fixedParams = params.filter((param) => parseInt(param.parameterType, 10) === 7);

    const display = sessionStorage.getItem('userBranches') === ''
      || sessionStorage.getItem('userBranches') === null
      || sessionStorage.getItem('userBranches') === undefined
      || sessionStorage.getItem('userBranches') === '[]';

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
                        {params.map((item) => item.parameterType).includes(1) ? (
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
                                  value={values.reportBranch}
                                  id="reportBranch"
                                  name="reportBranch"
                                  onChange={this.props.handleChange}
                                >
                                  <option value="">All Branches</option>
                                  {display
                                    ? values.companyBranches
                                      .filter((branch) => branch.isActive)
                                      .map((br, key) => {
                                        const selected = [
                                          br.id,
                                          br.hostBranchId,
                                        ];
                                        return (
                                          <option
                                            key={key}
                                            value={selected}
                                          >
                                            {br.name}
                                          </option>
                                        );
                                      })
                                    : JSON.parse(
                                      sessionStorage.getItem('userBranches'),
                                    ).map((b, i) => {
                                      const selected = [
                                        b.id,
                                        b.hostBranchId,
                                      ];
                                      return (
                                        <option key={i} value={selected}>
                                          {b.name}
                                        </option>
                                      );
                                    })}
                                </Form.Control>
                              </Col>
                            </Form.Group>
                          </Col>
                        ) : (
                          ''
                        )}
                        {params.map((item) => item.parameterType).includes(2) ? (
                          <Col xs={12} md={4}>
                            <Form.Group as={Row}>
                              <Form.Label column md="3">
                                Branch Code
                              </Form.Label>
                              <Col md="9">
                                <Form.Control
                                  autoComplete="off"
                                  type="text"
                                  as="select"
                                  value={values.reportBranchCode}
                                  id="reportBranchCode"
                                  name="reportBranchCode"
                                  onChange={this.props.handleChange}
                                >
                                  <option value="">All Branches</option>
                                  {display
                                    ? values.companyBranches
                                      .filter((branch) => branch.isActive)
                                      .map((br, key) => {
                                        const selected = [
                                          br.id,
                                          br.hostBranchCode,
                                        ];
                                        return (
                                          <option
                                            key={key}
                                            value={selected}
                                          >
                                            {br.name}
                                          </option>
                                        );
                                      })
                                    : JSON.parse(
                                      sessionStorage.getItem('userBranches'),
                                    ).map((b, i) => {
                                      const selected = [
                                        b.id,
                                        b.hostBranchCode,
                                      ];
                                      return (
                                        <option key={i} value={selected}>
                                          {b.name}
                                        </option>
                                      );
                                    })}
                                </Form.Control>
                              </Col>
                            </Form.Group>
                          </Col>
                        ) : (
                          ''
                        )}
                        {params.map((item) => item.parameterType).includes(3) ? (
                          <Col xs={12} md={4}>
                            <Form.Group as={Row}>
                              <Form.Label column md="3">
                                Relationship Officer
                              </Form.Label>
                              <Col md="9">
                                <Form.Control
                                  autoComplete="off"
                                  type="text"
                                  as="select"
                                  value={values.relationshipOfficerId}
                                  id="relationshipOfficerId"
                                  name="relationshipOfficerId"
                                  onChange={this.props.handleChange}
                                >
                                  <option value="">All ROs</option>
                                  {values.companyRelationshipOfficers
                                    .filter(
                                      (ro) => ro.status && ro.branchId === values.branchId,
                                    )
                                    .map((officer, key) => (
                                      <option key={key} value={officer.relationshipOfficerId}>
                                        {`${officer.firstName} ${officer.lastName}`}
                                      </option>
                                    ))}
                                </Form.Control>
                              </Col>
                            </Form.Group>
                          </Col>
                        ) : (
                          ''
                        )}
                        {params.map((item) => item.parameterType).includes(6) ? (
                          <Col xs={12} md={4}>
                            <Form.Group as={Row}>
                              <Form.Label column md="3">
                                Value
                              </Form.Label>
                              <Col md="9">
                                <Form.Control
                                  autoComplete="off"
                                  type="text"
                                  as="select"
                                  value={values.enumeration}
                                  id="enumeration"
                                  name="enumeration"
                                  onChange={this.props.handleChange}
                                >
                                  <option value="" />
                                  {values.enumerations
                                    .filter(
                                      (enumeration) => enumeration.key === values.reportParams.filter((parameter) => parameter.parameterType === 6)[0].enumerationKey,
                                    )
                                    .map((enm, key) => (
                                      <option key={key} value={enm.value}>
                                        {enm.description}
                                      </option>
                                    ))}
                                </Form.Control>
                              </Col>
                            </Form.Group>
                          </Col>
                        ) : (
                          ''
                        )}
                      </Form.Row>
                      <Form.Row>
                        {fixedParams.length > 0 ? (
                          fixedParams.map((param) => (
                            <Col xs={12} md={4}>
                              <Form.Group as={Row}>
                                <Form.Label column md="3">
                                  {param.fieldName}
                                </Form.Label>
                                <Col md="9">
                                  <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    value={values.fieldValue}
                                    id="fieldValue"
                                    name="fieldValue"
                                    onChange={this.props.handleChange}
                                  />
                                </Col>
                              </Form.Group>
                            </Col>
                          ))
                        ) : ''}
                      </Form.Row>

                      {values.reportParams.some(
                        (parameter) => parameter.parameterType === 5,
                      ) && values.reportParams
                        .filter((param) => param.parameterType === 5)[0]
                        .parameterUsers.includes(
                          parseInt(sessionStorage.getItem('userType')),
                        ) ? (
                          <Form.Row>
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
                                    dateFormat={values.reportParams
                                      .filter((param) => param.parameterType === 5)[0].dateParameterValue === 1 ? 'dd/MM/yyyy' : values.reportParams
                                        .filter((param) => param.parameterType === 5)[0].dateParameterValue === 2 ? 'MM/yyyy' : values.reportParams
                                          .filter((param) => param.parameterType === 5)[0].dateParameterValue === 3 ? 'yyyy' : 'dd/MM/yyyy'}
                                    onChange={(date) => this.props.setDate(date, 'startDate')}
                                    showMonthYearPicker={values.reportParams
                                      .filter((param) => param.parameterType === 5)[0].dateParameterValue === 2}
                                    showYearPicker={values.reportParams
                                      .filter((param) => param.parameterType === 5)[0].dateParameterValue === 3}
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
                                    dateFormat={values.reportParams
                                      .filter((param) => param.parameterType === 5)[0].dateParameterValue === 1 ? 'dd/MM/yyyy' : values.reportParams
                                        .filter((param) => param.parameterType === 5)[0].dateParameterValue === 2 ? 'MM/yyyy' : values.reportParams
                                          .filter((param) => param.parameterType === 5)[0].dateParameterValue === 3 ? 'yyyy' : 'dd/MM/yyyy'}
                                    onChange={(date) => this.props.setDate(date, 'endDate')}
                                    minDate={values.startDate}
                                    isClearable
                                    showMonthYearPicker={values.reportParams
                                      .filter((param) => param.parameterType === 5)[0].dateParameterValue === 2}
                                    showYearPicker={values.reportParams
                                      .filter((param) => param.parameterType === 5)[0].dateParameterValue === 3}
                                    disabled={values.dateRange !== 'Custom Range'}
                                    dropdownMode="select"
                                    onFocus={this.function.handleFocus}
                                    className="form-control"
                                  />
                                </Col>
                              </Form.Group>
                            </Col>
                          </Form.Row>
                        ) : (
                          ''
                        )}
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

export default ReportFilter;
