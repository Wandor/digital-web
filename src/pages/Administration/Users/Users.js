/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/default-props-match-prop-types */
import React from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Breadcrumb, Button } from 'react-bootstrap';
import * as Icon from 'react-feather';
import Navigation from '../../../components/Navigation/Navigation';
import Functions from '../../../utils/Functions';
import Services from '../../../utils/Services';
import Footer from '../../../components/Common/Footer';
import { tableIcons, tableOptions } from '../../../helpers/TableIcons';
import AlertDisplay from '../../../components/Common/Alert';
import Loader from '../../../components/Common/Loader';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      sideMenu: true,
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      alert: null,
      isLoading: false,
    };

    this.services = new Services(this);
    this.function = new Functions(this);
  }

  componentDidMount() {
    this.services.getCandidates();
  }

  render() {
    const columns = [
      {
        title: 'Names',
        field: 'firstName',
        render: (rowData) => (
          <div>
            {`${rowData.firstName} ${rowData.lastName}`}
          </div>
        ),
      },
      {
        title: 'Age',
        field: 'age',
      },
      {
        title: 'Gender',
        field: 'gender',
      },
      {
        title: 'Town',
        field: 'town',
      },
    ];

    let loader = null;
    if (this.state.isLoading) {
      loader = <Loader message="Sending..." />;
    }

    return (
      <div className="page-wrapper">
        {/* Navigation */}
        <Navigation onClick={this.function._onSideMenu} />
        {/* End Navigation */}

        <div
          className={`main-content d-flex flex-column ${
            this.state.sideMenu ? '' : 'hide-sidemenu'
          }`}
        >
          {/* Breadcrumb */}
          <div className="main-content-header">
            <Breadcrumb>
              <Breadcrumb.Item to="/">Candidates</Breadcrumb.Item>
              <Breadcrumb.Item active>Candidates Summary</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {/* End Breadcrumb */}
          {this.state.error || this.state.success ? (
            <AlertDisplay
              error={this.state.error}
              success={this.state.success}
              successMessage={this.state.successMessage}
              errorMessage={this.state.errorMessage}
              closeAlert={this.function.closeAlert}
            />
          ) : ''}
          {loader}
          <div className="card mb-4">
            <div className="card-body">
              <MaterialTable
                columns={columns}
                data={this.state.candidates}
                icons={tableIcons}
                title=""
                options={tableOptions}
                actions={[
                  (rowData) => ({
                    icon: () => (
                      <Icon.Edit2 className="text-primary icon wh-15 mt-minus-3" />
                    ),
                    tooltip: 'Edit User',
                    onClick: () => this.props.history.push(
                      `/app/edit-user/${rowData.id}`,
                    ),
                  }),
                  (rowData) => ({
                    icon: () => (
                      rowData.status ? <Icon.Trash className="text-danger icon wh-15 mt-minus-3" /> : <Icon.CheckCircle className="text-success icon wh-15 mt-minus-3" />
                    ),
                    tooltip: 'Delete user',
                    onClick: (e) => this.function.confirmPopup(e, rowData, 'delete', 'users'),
                  }),
                ]}
                components={{
                  Toolbar: (props) => (
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="text-left">
                          <div className="form-group">
                            <Button
                              type="submit"
                              variant="success"
                              size="xs"
                              onClick={() => this.props.history.push('/app/create-user')}
                            >
                              <i className="fa fa-plus-circle" />
                              {' '}
                              New Candidate
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4" />
                      <div className="col-lg-4">
                        <MTableToolbar {...props} />
                      </div>
                    </div>
                  ),
                }}
                isLoading={this.state.isLoading}
              />
            </div>
          </div>
          {this.state.alert}
          {/* Footer */}
          <div className="flex-grow-1" />
          <Footer />
          {/* End Footer */}
        </div>
      </div>
    );
  }
}

export default Users;
