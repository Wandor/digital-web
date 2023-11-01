/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-case-declarations */
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Africastalking from 'africastalking-client';
import {
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  startOfYear,
  endOfQuarter,
  endOfYear,
} from 'date-fns';
import { Buffer } from 'buffer';
import SweetAlert from 'react-bootstrap-sweetalert';
import Functions from './Functions';
import { subscribeUser } from '../subscription';
import jwt from '../helpers/auth/useJwt';

const defSuccessMessage = 'Operation was successful!';

class Services {
  constructor(that) {
    this.BASE_URL = 'http://localhost:8001';
    this.that = that;
    this.initialState = JSON.stringify(this.that.state);
    this.function = new Functions(this.that);
    this.AUTH = {
      Authorization: `Bearer ${sessionStorage.getItem('AuthToken')}`,
      'Access-Control-Allow-Origin': '*',
    };
    this.CONFIG = { headers: this.AUTH };
  }

  getCandidates = () => {
    this.function.setIsLoading('true');
    axios
      .get(
        `${this.BASE_URL}/api/v1/candidates`,
        this.CONFIG,
      )
      .then((response) => {
        this.function.setIsLoading('false');
        this.that.setState({
          companyUsers: response.data.companyUsers.filter(
            (user) => parseInt(user.userValue, 10) !== 4,
          ),
          companyRelationshipOfficers: response.data.companyUsers.filter(
            (user) => user.userType === 'Relationship Officer' && user.status === true,
          ),
          companyCallAgents: response.data.companyUsers.filter(
            (user) => user.userType === 'Call Agent' && user.status === true,
          ),
        });
      })
      .catch((error) => {
        this.function.handleError(error);
      });
  };

  getEnumerations = () => {
    axios
      .get(
        `${this.BASE_URL}/api/v1/enumerations`,
        this.CONFIG,
      )
      .then((res) => {
        this.that.setState({ enumerations: res.data.enumerations });
      })
      .catch((error) => {
        this.function.handleError(error);
      });
  };

  getCandidate = (id) => {
    this.function.setIsLoading('true');
    axios
      .get(
        `${this.BASE_URL}/api/v1/view-candidate/${id}`,
        this.CONFIG,
      )
      .then(async (response) => {
        this.function.setIsLoading('false');
        const data = [];
        response.data.user.Branches.forEach((branch) => {
          data.push(branch.id);
        });
        this.that.setState({
          item: response.data.user,
          selectedBranches: response.data.user.Branches,
          branchesID: data,
          contactEmailValid: true,
          contactValid: true,
          regionId: [response.data.user.regionId, response.data.user.branchId],
        });
        await delete response.data.user.regionId;
        this.that.setState({
          item: response.data.user,
        });
      })
      .then(async () => {
        this.function.populateFields(this.that);
      })
      .catch((error) => {
        this.function.handleError(error);
      });
  };

  submitAction = (item, special, action) => {
    let url = '';
    let data;
    switch (special) {
      case 'users':
        switch (action) {
          case 'post':
            url = `${this.BASE_URL}/api/v1/candidates/${sessionStorage.getItem(
              'companyId',
            )}?core=${'false'}`;
            data = item;
            break;
          case 'put':
            url = `${this.BASE_URL}/api/v1/update-candidate/edit/${
              this.that.state.candidateId
            }`;
            data = item;
            break;
          case 'delete':
            url = `${
              this.BASE_URL
            }/api/v1/user/delete-candidate/${item}`;
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
    const process = action === 'delete' ? 'put' : action;
    switch (process) {
      case 'post':
        this.__createSubmission(process, url, data, special);
        break;
      case 'put':
        this.__updateSubmission(process, url, data, special);
        break;
      default:
        break;
    }
  };

  __createSubmission = (method, url, data, special) => {
    this.function.setIsLoading('true');
    axios
      .post(url, data, this.CONFIG)
      .then((response) => {
        this.function.setIsLoading('false');
        if (
          response.status === 200
          || response.status === 201
          || response.status === 204
        ) {
          const message = response.data.message || defSuccessMessage;
          this.function.setMessage('success', message);

          this.function.setIsLoading('false');
          switch (special) {
            case 'companies':
              setTimeout(
                () => this.that.props.history.push('/superadmin/companies'),
                1000,
              );
              this.getRegisteredCompanies();

              break;
            case 'fees':
              setTimeout(() => this.that.props.history.push('/app/fees'), 1000);
              this.getFees();
              break;
            case 'loanProducts':
              setTimeout(
                () => this.that.props.history.push('/app/loan-products'),
                1000,
              );
              this.getLoanProducts();
              break;
            case 'markets':
              setTimeout(
                () => this.that.props.history.push('/app/markets'),
                1000,
              );
              this.getMarkets(10, 0, '', 'paginated');
              break;
            case 'generalLedgerAccountMappings':
              setTimeout(
                () => this.that.props.history.push('/app/gl-mappings'),
                1000,
              );
              this.getGeneralLedgerAccountMappings();
              break;
            case 'registerLoans':
              setTimeout(
                () => this.that.props.history.push('/app/registered-loans'),
                1000,
              );
              this.getLoans();
              break;
            case 'password':
              setTimeout(() => this.that.props.history.push('/'), 1000);
              break;
            case 'approveLoan':
              setTimeout(
                () => this.that.props.history.push('/app/loan-approvals'),
                1000,
              );
              this.getLoanApprovals();
              break;
            case 'approveDisbursement':
              setTimeout(
                () => this.that.props.history.push('/app/loan-disbursements'),
                1000,
              );
              this.getLoanDisbursements();
              break;
            case 'savingsProducts':
              setTimeout(
                () => this.that.props.history.push('/app/savings-products'),
                1000,
              );
              this.getSavingsProducts();
              break;
            case 'penalties':
              setTimeout(
                () => this.that.props.history.push('/app/penalties'),
                1000,
              );
              this.getPenalties();
              break;
            case 'loanPurposes':
              setTimeout(
                () => this.that.props.history.push('/app/loan-purposes'),
                1000,
              );
              this.getLoanPurposes();
              break;
            case 'subscriptions':
              setTimeout(
                () => this.that.props.history.push('/superadmin/subscriptions'),
                1000,
              );
              this.getSubscriptions();
              break;
            case 'voiceSubscriptions':
              setTimeout(
                () => this.that.props.history.push(
                  '/superadmin/voice-subscriptions',
                ),
                1000,
              );
              this.getVoiceSubscriptions();
              break;
            case 'subscriptionPreferences':
              setTimeout(
                () => this.that.props.history.push('/app/company-subscriptions'),
                1000,
              );
              this.getCompanySubscriptions();
              break;
            case 'marketingLeads':
              setTimeout(
                () => this.that.props.history.push('/app/marketing-leads'),
                1000,
              );
              this.getCompanyLeads();
              break;
            case 'uploadMpesaStatement':
              setTimeout(
                () => this.that.props.history.push('/app/marketing-leads'),
                1000,
              );
              break;
            case 'modules':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              this.getCompanyModules(window.location.href.split('/').pop());
              break;
            case 'loanReversal':
              setTimeout(
                () => this.that.props.history.push('/app/loan-reversal'),
                1000,
              );
              break;
            case 'loanWriteOff':
              setTimeout(
                () => this.that.props.history.push('/app/loan-write-off'),
                1000,
              );
              this.getLoanWriteOffList();
              break;
            case 'employer':
              setTimeout(
                () => this.that.props.history.push('/app/employers'),
                1000,
              );
              break;
            case 'employees':
              setTimeout(
                () => this.that.props.history.push('/app/view-employee-uploads'),
                1000,
              );
              this.getEmployeeFileUploads();
              break;
            case 'checkoffs':
              setTimeout(
                () => this.that.props.history.push('/app/view-checkoff-uploads'),
                1000,
              );
              this.getCheckOffFileUploads();
              break;
            case 'limitRules':
              setTimeout(
                () => this.that.props.history.push('/app/limit-rules'),
                1000,
              );
              this.getCompanyLimitRules();
              break;
            case 'scoringRules':
              setTimeout(
                () => this.that.props.history.push('/app/scoring-rules'),
                1000,
              );
              this.getCompanyScoringRules();
              break;
            case 'limitAdjustments':
              setTimeout(
                () => this.that.props.history.push('/app/limit-histories'),
                1000,
              );
              this.getLimitHistories();
              break;
            case 'lockChanges':
              setTimeout(() => this.that.props.history.goBack(), 1000);

              break;
            case 'smsTemplates':
              setTimeout(
                () => this.that.props.history.push('/app/sms-templates'),
                1000,
              );
              this.getTemplates();
              break;
            case 'scheduledMessages':
              setTimeout(
                () => this.that.props.history.push('/app/scheduled-messages'),
                1000,
              );
              this.getScheduledMessages();
              break;
            case 'chartOfAccounts':
              setTimeout(
                () => this.that.props.history.push('/app/chart-of-accounts'),
                1000,
              );
              this.getChartOfAccounts();
              break;
            case 'journalEntries':
              setTimeout(
                () => this.that.props.history.push('/app/journals'),
                1000,
              );
              this.getJournalEntries();
              break;
            case 'customerAccounts':
              setTimeout(
                () => this.that.props.history.push('/app/customer-accounts'),
                1000,
              );
              this.getCustomerAccounts();
              break;
            case 'payments':
              setTimeout(
                () => this.that.props.history.push('/app/billing'),
                1000,
              );
              break;
            case 'messages':
              setTimeout(
                () => this.that.props.history.push('/app/sms-outbox'),
                1000,
              );
              this.getCompanyOutbox(10, 0);
              break;
            case 'callCentreMessages':
              const criteria = JSON.parse(sessionStorage.getItem('filtersToApply'))
                  === undefined
                || JSON.parse(sessionStorage.getItem('filtersToApply')) === null
                ? []
                : JSON.parse(sessionStorage.getItem('filtersToApply'));
              setTimeout(
                () => this.that.props.history.push(
                  `/app/follow-up-cases/${this.that.state.currentPage}`,
                ),
                1000,
              );
              this.getFollowUpCases(
                10,
                this.that.state.currentPage,
                '',
                criteria,
              );
              break;
            case 'kpiCategories':
              setTimeout(
                () => this.that.props.history.push('/app/kpi-categories'),
                1000,
              );
              this.getKpiCategories();
              break;
            case 'kpiDetails':
              setTimeout(() => this.function.refresh(), 1000);
              break;
            case 'userTargets':
              setTimeout(() => this.function.refresh(), 1000);
              break;

            case 'kpis':
              this.getKPIDetails(
                moment(startOfMonth(new Date())).format('YYYY-MM-DD'),
                moment(endOfMonth(new Date())).format('YYYY-MM-DD'),
              );
              break;
            case 'customerAllocation':
              setTimeout(() => this.function.refresh(), 1000);
              break;
            case 'followUpNotes':
              const criteri = JSON.parse(sessionStorage.getItem('filtersToApply'))
                  === undefined
                || JSON.parse(sessionStorage.getItem('filtersToApply')) === null
                ? []
                : JSON.parse(sessionStorage.getItem('filtersToApply'));
              setTimeout(
                () => this.that.props.history.push(
                  `/app/follow-up-cases/${parseInt(
                    window.location.href.split('/')[5],
                    10,
                  )}`,
                ),
                1000,
              );
              this.getFollowUpCases(
                10,
                sessionStorage.getItem('FollowUpOffset') * 10,
                '',
                criteri,
              );
              break;
            case 'alternativeContacts':
              this.getCustomerAlternativeContacts(this.that.state.customerId);
              break;
            case 'coreBranches':
              setTimeout(
                () => this.that.props.history.push('/app/branches'),
                1000,
              );
              this.getCompanyBranches();
              break;
            case 'coreUsers':
              this.getCoreUsers();

              break;

            case 'branches':
              setTimeout(
                () => this.that.props.history.push('/app/branches'),
                1000,
              );
              this.getCompanyBranches();
              break;
            case 'charges':
              setTimeout(
                () => this.that.props.history.push('/superadmin/charges'),
                1000,
              );
              this.getCharges();
              break;
            case 'regions':
              setTimeout(
                () => this.that.props.history.push('/app/regions'),
                1000,
              );
              this.getRegions();
              break;
            case 'configurations':
              setTimeout(
                () => this.that.props.history.push('/superadmin/configurations'),
                1000,
              );
              break;
            case 'companySetting':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              break;
            case 'rejectionReasons':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              break;
            case 'passwordPolicy':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              break;
            case 'users':
              setTimeout(
                () => this.that.props.history.push('/app/users'),
                1000,
              );
              this.getCompanyUsers();
              break;
            case 'supportUsers':
              if (window.location.href.split('/').pop() !== '') {
                setTimeout(
                  () => this.that.props.history.push('/superadmin/users'),
                  1000,
                );
                this.getCompanyUsers();
              }
              break;
            case 'investors':
              setTimeout(
                () => this.that.props.history.push('/app/investors'),
                1000,
              );
              this.getAllInvestors();
              break;
            case 'reports':
              setTimeout(
                () => this.that.props.history.push('/app/reports'),
                1000,
              );
              this.getReports();
              break;
            case 'reportCategories':
              setTimeout(
                () => this.that.props.history.push('/app/report-categories'),
                1000,
              );
              this.getReportCategories();
              break;
            case 'allocateReports':
              setTimeout(
                () => this.that.props.history.push('/app/report-categories'),
                1000,
              );
              this.getReportCategories();
              break;
            case 'investments':
              setTimeout(
                () => this.that.props.history.push('/app/investments'),
                1000,
              );
              this.getAllInvestors();
              break;
            case 'customerPersonalDetails':
              this.function.nextStep();
              this.function.restValues();
              this.that.setState({
                customerDraftId: response.data,
              });
              sessionStorage.setItem('customerDraftId', response.data);
              break;
            case 'createCustomer':
              this.function.nextStep();
              this.function.restValues();
              this.that.setState({
                customerDraftId: response.data,
              });
              sessionStorage.setItem('customerDraftId', response.data);
              break;
            case 'convertLead':
              this.function.nextStep();
              this.function.restValues();
              this.that.setState({
                customerDraftId: response.data,
              });
              sessionStorage.setItem('customerDraftId', response.data);
              break;
            case 'interestRateBands':
              setTimeout(
                () => this.that.props.history.push('/app/interest-rate-bands'),
                1000,
              );
              this.getAllInvestmentRateBands();
              break;
            case 'visitNotes':
              setTimeout(
                () => this.that.props.history.push('/app/due-visits'),
                1000,
              );
              this.getDueVisits('', '');
              break;
            case 'arrearsEscalationVisitNotes':
              setTimeout(
                () => this.that.props.history.push(
                  `/app/visit-notes/${this.that.state.id}`,
                ),
                1000,
              );
              this.services.getLoanArrearsVisitNotes(this.that.state.id);
              break;
            case 'roles':
              setTimeout(
                () => this.that.props.history.push('/app/roles'),
                1000,
              );
              this.getCompanyRoles(sessionStorage.getItem('companyId'));
              break;
            case 'companyRoles':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        this.function.handleError(error);
      });
  };

  __updateSubmission = (method, url, data, special) => {
    this.function.setIsLoading('true');
    axios
      .put(url, data, this.CONFIG)
      .then((response) => {
        this.function.setIsLoading('false');
        if (
          response.status === 200
          || response.status === 201
          || response.status === 204
        ) {
          const message = response.data.message || defSuccessMessage;
          this.function.setMessage('success', message);

          this.function.setIsLoading('false');
          switch (special) {
            case 'users':
              setTimeout(
                () => this.that.props.history.push('/app/users'),
                1000,
              );
              this.getCompanyUsers();
              break;
            case 'companies':
              setTimeout(
                () => this.that.props.history.push('/superadmin/companies'),
                1000,
              );
              this.getRegisteredCompanies();

              break;
            case 'fees':
              setTimeout(() => this.that.props.history.push('/app/fees'), 1000);
              this.getFees();
              break;
            case 'loanProducts':
              setTimeout(
                () => this.that.props.history.push('/app/loan-products'),
                1000,
              );
              this.getLoanProducts();
              break;
            case 'markets':
              setTimeout(
                () => this.that.props.history.push('/app/markets'),
                1000,
              );
              this.getMarkets(10, 0, '', 'paginated');
              break;
            case 'generalLedgerAccountMappings':
              setTimeout(1000);
              this.getGeneralLedgerAccountMappings();
              break;

            case 'registerLoans':
              setTimeout(1000);
              this.getLoans();
              break;
            case 'password':
              setTimeout(() => this.that.props.history.push('/'), 1000);
              break;
            case 'approveLoan':
              setTimeout(
                () => this.that.props.history.push('/app/loan-approvals'),
                1000,
              );
              this.getLoanApprovals();
              break;
            case 'approveDisbursement':
              setTimeout(
                () => this.that.props.history.push('/app/loan-disbursements'),
                1000,
              );
              this.getLoanDisbursements();
              break;
            case 'savingsProducts':
              setTimeout(
                () => this.that.props.history.push('/app/savings-products'),
                1000,
              );
              this.getSavingsProducts();
              break;
            case 'penalties':
              setTimeout(
                () => this.that.props.history.push('/app/penalties'),
                1000,
              );
              this.getPenalties();
              break;
            case 'loanPurposes':
              setTimeout(
                () => this.that.props.history.push('/app/loan-purposes'),
                1000,
              );
              this.getLoanPurposes();
              break;
            case 'branches':
              setTimeout(
                () => this.that.props.history.push('/app/branches'),
                1000,
              );
              this.getCompanyBranches();
              break;
            case 'charges':
              setTimeout(
                () => this.that.props.history.push('/superadmin/charges'),
                1000,
              );
              this.getCharges();
              break;
            case 'regions':
              setTimeout(
                () => this.that.props.history.push('/app/regions'),
                1000,
              );
              this.getRegions();
              break;
            case 'configurations':
              setTimeout(
                () => this.that.props.history.push('/superadmin/configurations'),
                1000,
              );
              break;
            case 'companySetting':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              break;
            case 'rejectionReasons':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              break;
            case 'passwordPolicy':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              break;
            case 'subscriptions':
              setTimeout(
                () => this.that.props.history.push('/superadmin/subscriptions'),
                1000,
              );
              this.getSubscriptions();
              break;
            case 'voiceSubscriptions':
              setTimeout(
                () => this.that.props.history.push(
                  '/superadmin/voice-subscriptions',
                ),
                1000,
              );
              this.getVoiceSubscriptions();
              break;
            case 'subscriptionPreferences':
              setTimeout(
                () => this.that.props.history.push('/app/company-subscriptions'),
                1000,
              );
              this.getCompanySubscriptions();
              break;
            case 'loanReversal':
              setTimeout(
                () => this.that.props.history.push('/app/loan-reversal'),
                1000,
              );
              break;
            case 'loanWriteOff':
              setTimeout(
                () => this.that.props.history.push('/app/loan-write-off'),
                1000,
              );
              this.getLoanWriteOffList();
              break;
            case 'linkEmployer':
              setTimeout(
                () => this.that.props.history.push('/app/support-dashboard'),
                1000,
              );
              break;
            case 'employer':
              setTimeout(
                () => this.that.props.history.push('/app/employers'),
                1000,
              );
              break;
            case 'approveEmployer':
              setTimeout(
                () => this.that.props.history.push('/app/employers'),
                1000,
              );
              break;
            case 'employees':
              setTimeout(
                () => this.that.props.history.push(
                  `/app/employees/${this.that.state.employerId}`,
                ),
                1000,
              );
              this.getEmployees(this.that.state.employerId);
              break;
            case 'checkoffs':
              setTimeout(() => this.function.refresh(), 1000);
              break;
            case 'marketingLeads':
              setTimeout(
                () => this.that.props.history.push('/app/marketing-leads'),
                1000,
              );
              this.getCompanyLeads();
              break;
            case 'customerApprovals':
              setTimeout(
                () => this.that.props.history.push('/app/customers-approvals'),
                1000,
              );
              this.getCompanyCustomerApprovals();
              break;
            case 'customerCallbacks':
              setTimeout(
                () => this.that.props.history.push('/app/customer-callbacks'),
                1000,
              );
              this.getCompanyCustomerCallbacks();
              break;
            case 'modules':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              this.getCompanyModules(window.location.href.split('/').pop());
              break;
            case 'limitRules':
              setTimeout(
                () => this.that.props.history.push('/app/limit-rules'),
                1000,
              );
              this.getCompanyLimitRules();
              break;
            case 'scoringRules':
              setTimeout(
                () => this.that.props.history.push('/app/scoring-rules'),
                1000,
              );
              this.getCompanyScoringRules();
              break;
            case 'limitAdjustments':
              setTimeout(
                () => this.that.props.history.push('/app/limit-histories'),
                1000,
              );
              this.getLimitHistories();
              break;
            case 'lockChanges':
              setTimeout(() => this.that.props.history.goBack(), 1000);

              break;
            case 'smsTemplates':
              setTimeout(
                () => this.that.props.history.push('/app/sms-templates'),
                1000,
              );
              this.getTemplates();
              break;
            case 'scheduledMessages':
              setTimeout(
                () => this.that.props.history.push('/app/scheduled-messages'),
                1000,
              );
              this.getScheduledMessages();
              break;
            case 'chartOfAccounts':
              setTimeout(
                () => this.that.props.history.push('/app/chart-of-accounts'),
                1000,
              );
              this.getChartOfAccounts();
              break;
            case 'journalEntries':
              setTimeout(
                () => this.that.props.history.push('/app/journals'),
                1000,
              );
              this.getJournalEntries();
              break;
            case 'customerAccounts':
              setTimeout(
                () => this.that.props.history.push('/app/customer-accounts'),
                1000,
              );
              this.getCustomerAccounts();
              break;
            case 'payments':
              setTimeout(
                () => this.that.props.history.push('/app/billing'),
                1000,
              );
              break;
            case 'messages':
              setTimeout(
                () => this.that.props.history.push('/app/sms-outbox'),
                1000,
              );
              this.getCompanyOutbox(10, 0);
              break;
            case 'callCentreMessages':
              const criteia = JSON.parse(sessionStorage.getItem('filtersToApply'))
                  === undefined
                || JSON.parse(sessionStorage.getItem('filtersToApply')) === null
                ? []
                : JSON.parse(sessionStorage.getItem('filtersToApply'));
              setTimeout(
                () => this.that.props.history.push('/app/follow-up-cases'),
                1000,
              );
              this.getFollowUpCases(
                10,
                this.that.state.currentPage * 10,
                '',
                criteia,
              );
              break;
            case 'kpiCategories':
              setTimeout(
                () => this.that.props.history.push('/app/kpi-categories'),
                1000,
              );
              this.getKpiCategories();
              break;
            case 'kpiDetails':
              if (window.location.href.split('/')[4] !== 'allocate-targets') {
                document.getElementById(
                  `${data.branchId}-value`,
                ).disabled = true;
                const item = { id: data.branchId };
                document.getElementById(`${data.branchId}-button`).innerHTML = 'Edit';
                document
                  .getElementById(`${data.branchId}-button`)
                  .classList.remove('btn-outline-success');
                document
                  .getElementById(`${data.branchId}-button`)
                  .classList.add('btn-outline-primary');
                document.getElementById(`${data.branchId}-button`).onclick = (
                  e,
                ) => this.that.handleEdit(e, item);
              }

              this.that.setState({
                [`${data.branchId}-recordStatus`]: data.recordStatus,
              });
              break;
            case 'userTargets':
              document.getElementById(`${data.userId}-value`).disabled = true;
              const item = { id: data.userId };
              document.getElementById(`${data.userId}-button`).innerHTML = 'Edit';
              document
                .getElementById(`${data.userId}-button`)
                .classList.remove('btn-outline-success');
              document
                .getElementById(`${data.userId}-button`)
                .classList.add('btn-outline-primary');
              document.getElementById(`${data.userId}-button`).onclick = (e) => this.that.handleEdit(e, item);
              this.that.setState({
                [`${data.userId}-recordStatus`]: data.recordStatus,
              });
              this.getBranchKpiTarget(
                window.location.href.split('/').pop(),
                'false',
              );
              break;
            case 'kpis':
              this.getKPIDetails(
                moment(startOfMonth(new Date())).format('YYYY-MM-DD'),
                moment(endOfMonth(new Date())).format('YYYY-MM-DD'),
              );
              break;
  
            case 'supportUsers':
              if (window.location.href.split('/').pop() !== '') {
                setTimeout(
                  () => this.that.props.history.push('/superadmin/users'),
                  1000,
                );
                this.getCompanyUsers();
              } else {
                if (sessionStorage.getItem('twoFactorEnabled') === 'false') {
                  this.getUserData(
                    sessionStorage.getItem('emailAddress'),
                    sessionStorage.getItem('AuthToken'),
                  );
                } else {
                  this.that.setState({
                    showOTP:
                      sessionStorage.getItem('twoFactorEnabled') !== 'false',
                  });
                }
              }
              break;
            case 'coreUsers':
              this.getCoreUsers();
              break;
            case 'reports':
              setTimeout(
                () => this.that.props.history.push('/app/reports'),
                1000,
              );
              this.getReports();
              break;
            case 'reportCategories':
              setTimeout(
                () => this.that.props.history.push('/app/report-categories'),
                1000,
              );
              this.getReportCategories();
              break;
            case 'allocateReports':
              setTimeout(
                () => this.that.props.history.push('/app/report-categories'),
                1000,
              );
              this.getReportCategories();
              break;
            case 'investors':
              setTimeout(
                () => this.that.props.history.push('/app/investors'),
                1000,
              );
              this.getAllInvestors();

              break;
            case 'investorProfile':
              setTimeout(
                () => this.that.props.history.push(
                  `/app/investor-dashboard/${sessionStorage.getItem(
                    'userId',
                  )}`,
                ),
                1000,
              );
              this.getInvestorProfile(`${sessionStorage.getItem('userId')}`);

              break;
            case 'investments':
              setTimeout(
                () => this.that.props.history.push('/app/investments'),
                1000,
              );
              this.getAllInvestments();

              break;
            case 'investmententries':
              setTimeout(
                () => this.that.props.history.push('/app/investments'),
                1000,
              );
              this.getAllInvestments();

              break;
            case 'investorSettlements':
              setTimeout(
                () => this.that.props.history.push('/app/investor-settlements'),
                1000,
              );
              this.getAllInvestorSettlements();

              break;
            case 'interestRateBands':
              setTimeout(
                () => this.that.props.history.push('/app/interest-rate-bands'),
                1000,
              );
              this.getAllInvestmentRateBands();

              break;
            case 'customerAllocation':
              setTimeout(() => this.function.refresh(), 1000);
              break;
            case 'bulkCustomerAllocation':
              setTimeout(() => this.function.refresh(), 1000);
              break;
            case 'shuffleAgent':
              setTimeout(() => this.function.refresh(), 1000);
              break;
            case 'roles':
              setTimeout(
                () => this.that.props.history.push('/app/roles'),
                1000,
              );
              this.getCompanyRoles(sessionStorage.getItem('companyId'));
              break;
            case 'companyRoles':
              setTimeout(() => this.that.props.history.goBack(), 1000);
              break;
            case 'companyRolesDeactivate':
              // eslint-disable-next-line no-unused-expressions
              const id = window.location.href.split('/').pop();
              this.getCompaniesRoles(id);
              break;
            case 'customerDraftDetails':
              this.function.nextStep();
              this.function.restValues();
              break;
            case 'completeCustomerDraftDetails':
              setTimeout(
                () => this.that.props.history.push('/app/customers'),
                1000,
              );
              localStorage.removeItem('customerDraftId');
              sessionStorage.removeItem('customerDraftId');
              this.getCompanyCustomers();
              break;
            case 'customerDetails':
              if (window.location.href.split('/')[4] !== 'customer-edit') {
                setTimeout(
                  () => this.that.props.history.push('/app/customers'),
                  1000,
                );
                this.getCompanyCustomers();
              }

              break;

            default:
              break;
          }
        }
      })
      .catch((error) => {
        this.function.handleError(error);
      });
  };
}

export default Services;
