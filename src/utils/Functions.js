/* eslint-disable class-methods-use-this */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable no-lonely-if */
/* eslint-disable no-return-assign */
/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment';
import readXlsxFile from 'read-excel-file';
import cloudinary from 'cloudinary/lib/cloudinary';
import { defineds } from '../helpers/DateRanges';

const defErrorMessage = 'An error occured processing your current request!';
class Functions {
  constructor(that) {
    this.that = that;
    this.initialState = JSON.stringify(that.state);
  }

  showWidget = (special, url) => (e) => {
    e.preventDefault();
    if (this.that.state[`${url}ImageId`] !== '') {
      cloudinary.config({
        cloud_name: process.env.REACT_APP_CLOUD_NAME,
        upload_preset: process.env.REACT_APP_UPLOAD_PRESET,
        api_key: '381155163142449',
        api_secret: 'ORnIjWhdU7gRK3KxvpUIo-J0Nqo',
      });

      cloudinary.v2.uploader
        .destroy(this.that.state[`${url}ImageId`], (error, result) => {
          if (!error && result && result.event === 'success') {
            this.that.setState({
              [`${url}ImageId`]: '',
            });
          }
        })
        .then((resp) => {
          const widget = window.cloudinary.createUploadWidget(
            {
              cloudName: process.env.REACT_APP_CLOUD_NAME,
              upload_preset: process.env.REACT_APP_UPLOAD_PRESET,
              api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
              sources: ['local', 'camera'],
              folder: process.env.REACT_APP_CLOUDINARY_FILES_FOLDER,
              cropping: true,
            },
            (error, result) => {
              if (!error && result && result.event === 'success') {
                const files = this.that.state.files.filter(
                  (file) => file.publicId.trim() === this.that.state[`${url}ImageId`],
                );

                const obj = {
                  url: result.info.url,
                  documentId: result.info.etag,
                  documentType: special,
                  publicId: result.info.public_id,
                };
                files.push(obj);
                this.that.setState({
                  [`${url}`]: result.info.url,
                  documentId: result.info.etag,
                  documentType: special,
                  [`${url}ImageId`]: result.info.public_id,
                  files,
                });
              }
            },
          );
          widget.open();
        })
        .catch((_err) => {
          // eslint-disable-next-line no-console
          this.setMessage('error', 'Can not replace Image');
        });
    } else {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.REACT_APP_CLOUD_NAME,
          upload_preset: process.env.REACT_APP_UPLOAD_PRESET,
          api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
          sources: ['local', 'camera'],
          folder: process.env.REACT_APP_CLOUDINARY_FILES_FOLDER,
          cropping: true,
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            const files = this.that.state.files;
            const obj = {
              url: result.info.url,
              documentId: result.info.etag,
              documentType: special,
              publicId: result.info.public_id,
            };
            files.push(obj);
            this.that.setState({
              [`${url}`]: result.info.url,
              documentId: result.info.etag,
              documentType: special,
              [`${url}ImageId`]: result.info.public_id,
              files,
            });
          }
        },
      );
      widget.open();
    }
  };

  // handles input change
  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    if (
      name === 'otp1'
      || name === 'otp2'
      || name === 'otp3'
      || name === 'otp4'
      || name === 'otp5'
      || name === 'otp6'
    ) {
      const reg = /^[0-9\b]+$/;

      if (reg.test(event.target.value)) {
        this.that.setState({
          [name]: target.value,
        });
      }
    } else {
      this.that.setState({
        [name]: target.value,
      });
      switch (name) {
        case 'loginCompany':
          this.that.setState({
            loginCompany: event.target.value,
          });
          this.that.services.getBranches(event.target.value);
          this.that.services.getCompanyRoles(event.target.value);
          sessionStorage.setItem('companyId', event.target.value);
          break;

        case 'userType':
          if (window.location.href.split('/')[4].split('-')[1] !== 'role') {
            if (parseInt(event.target.value, 10) !== 6) {
              this.that.setState({
                userType: event.target.value,
              });
            } else {
              this.setMessage('error', 'No rights to allocate this user type to a user!');
              this.that.setState({
                userType: '',
              });
            }
          }

          break;
        case 'journalType':
          this.that.setState({
            searchResults: [],
            customerAccounts: [],
            journalType: event.target.value,
          });
          document.getElementById('accountName').value = '';

          break;

        case 'emailAddress':
          if (event.target.value.length > 5) {
            this.that.setState({
              emailValid: this.isEmail(event.target.value.trim()),
              emailAddress: event.target.value,
            });
          }

          break;

        case 'reason':
          this.that.setState({
            comments: event.target.value.split(',')[1],
            reasonId: event.target.value.split(',')[0],
          });

          break;
        case 'reportBranch':
          if (event.target.value === '') {
            window.location.reload();
            sessionStorage.removeItem('reportPath');
          } else {
            this.that.setState({
              branchId: event.target.value.split(',')[0],
              hostBranchId: event.target.value.split(',')[1],
            });
          }

          break;
        case 'reportRelationshipOfficerId':
          if (event.target.value === '') {
            window.location.reload();
            sessionStorage.removeItem('reportPath');
          } else {
            this.that.setState({
              relationshipOfficerId: event.target.value,
            });
          }

          break;
        case 'reportBranchCode':
          if (event.target.value === '') {
            window.location.reload();
            sessionStorage.removeItem('reportPath');
          } else {
            this.that.setState({
              branchId: event.target.value.split(',')[0],
              hostBranchId: event.target.value.split(',')[1],
            });
          }

          break; case 'statementEmailAddress':
          if (event.target.value.length > 5) {
            this.that.setState({
              statementEmailValid: this.isEmail(event.target.value.trim()),
              statementEmailAddress: event.target.value,
            });
          }

          break;
        case 'templateMessageBody':
          if (parseInt(this.that.state.sendMessage, 10) === 1) {
            const datarecipients = this.that.state.recipients;
            datarecipients.push(this.that.state.phoneNumber);
            this.that.setState({
              recipients: datarecipients,
            });
            const messages = [];
            const messagesArray = [];
            const [firstName, lastName] = this.that.state.customerName.split(' ');
            const customerInformation = {
              CustomerFirstName: firstName,
              CustomerLastName: lastName,
              CustomerName: this.that.state.customerName,
              PhoneNumber: this.that.state.phoneNumber,
              ArrearsAmount:
                (this.that.state.olbAmount === ''
                || this.that.state.olbAmount === null
                || this.that.state.olbAmount === undefined)
                && this.that.state.amountDueToday === 0
                  ? this.that.state.olbAmount
                  : (this.that.state.olbAmount === ''
                  || this.that.state.olbAmount === null
                  || this.that.state.olbAmount === undefined)
                  && this.that.state.amountDueToday > 0
                    ? (this.that.state.olbAmount + this.that.state.amountDueToday)
                    : this.that.state.olbAmount.toLocaleString(),
              OverDueDays: this.that.state.followUpAge,
              PTPAmount:
                this.that.state.ptpAmount === ''
                || this.that.state.ptpAmount === null
                || this.that.state.ptpAmount === undefined
                  ? this.that.state.ptpAmount
                  : this.that.state.ptpAmount.toLocaleString(),
              PTPDate:
                this.that.state.ptpDate === ''
                || this.that.state.ptpDate === null
                || this.that.state.ptpDate === undefined
                  ? this.that.state.ptpDate
                  : moment(this.that.state.ptpDate).format('DD-MMM-YYYY'),
            };

            let myMessage = event.target.value;
            const replaceArray = Object.keys(customerInformation);
            const mapping = {};
            replaceArray.forEach(
              (e, i) => (mapping[`{${e}}`] = customerInformation[`${e}`]),
            );
            const re = /\{.*\}/;
            myMessage = re.test(myMessage)
              ? myMessage.replace(/\{\w+\}/gi, (n) => mapping[n])
              : event.target.value;
            messages.push(myMessage);

            const arr = {
              companyId: sessionStorage.getItem('companyId'),
              recipient: this.that.state.phoneNumber,
              charCount: myMessage.length,
              messageBody: myMessage,
              status: 0,
              isCoreMessage: 0,
              createdBy: sessionStorage.getItem('userId'),
              scheduledDate: new Date().toLocaleString(),
            };
            messagesArray.push(arr);
            messages.push(myMessage);
            this.that.setState({
              messages,
              previewMessage: myMessage,
              messagesArray,
            });
          }
          break;
        case 'email':
          if (event.target.value.length > 5) {
            this.that.setState({
              emailValid: this.isEmail(event.target.value.trim()),
              email: event.target.value,
            });
          }

          break;
        case 'ptpUploadExcel':
          const ptpInput = document.getElementById('ptpUploadExcel');
          if (ptpInput.files[0].name.split('.')[1] !== 'xlsx') {
            this.setMessage('error', 'File should be in .xlsx format!');
          } else {
            const data = [];
            readXlsxFile(ptpInput.files[0]).then((rows) => {
              const obj = rows;
              rows.forEach((row) => {
                const objArry = {
                  phoneNumber: row[0],
                };
                data.push(objArry);
              });
              this.that.setState({
                recipients: data,
                scores: data.splice(0, 1),
                fileName: ptpInput.files[0].name.split('.')[0],
              });
            });
          }

          break;
        case 'existingTemplate':
          this.that.setState({
            messageBody: event.target.value.split('#')[2],
            templateName: event.target.value.split('#')[1],
          });
          break;
        case 'mobilePhoneNumber':
          if (event.target.value.length > 5) {
            this.that.setState({
              mobilePhoneValid: this.isPhoneNumber(event.target.value.trim()),
              mobilePhoneNumber: event.target.value,
            });
          }

          break;
        case 'installmentsPhoneNumber':
          if (event.target.value.length === 12) {
            this.that.setState({
              installmentsPhoneNumber: event.target.value,
            });
            this.that.services.getLoanInformation(event.target.value);
          }
          break;
        case 'checkOffemployerId':
          this.that.setState({
            checkOffemployerId: event.target.value,
          });
          this.that.services.getCheckOffs(event.target.value);
          break;
        case 'reversalPhoneNumber':
          if (event.target.value.length === 12) {
            this.that.setState({
              reversalPhoneNumber: event.target.value,
            });
            this.that.services.getLoanReversalDetails(event.target.value);
          }
          break;
        case 'writeOffPhoneNumber':
          if (event.target.value.length === 12) {
            this.that.setState({
              writeOffPhoneNumber: event.target.value,
            });
            this.that.services.getLoanWriteOffDetails(event.target.value);
          }
          break;
        case 'employerLinkPhoneNumber':
          if (event.target.value.length === 12) {
            this.that.setState({
              employerLinkPhoneNumber: event.target.value,
            });
            this.that.services.getSupportCustomerDetails(event.target.value);
          }
          break;
        case 'phoneNumber':
          if (event.target.value.length > 5) {
            this.that.setState({
              phoneValid: this.isPhoneNumber(event.target.value.trim()),
              phoneNumber: event.target.value,
            });
          }

          break;

        case 'voicePhoneNumber':
          if (event.target.value.length > 5) {
            this.that.setState({
              phoneValid: this.isPhoneNumber(event.target.value.trim()),
              phoneNumber: event.target.value,
            });
          }

          break;

        case 'dateOfBirth':
          if (
            new Date().getFullYear()
              - new Date(event.target.value).getFullYear()
            < 18
          ) {
            this.that.setState({
              dateValid: false,
            });
          } else {
            this.that.setState({
              dateOfBirth: event.target.value,
              dateValid: true,
            });
          }

          break;
        case 'recipientExcel':
          const input = document.getElementById('recipientExcel');
          if (input.files[0].name.split('.')[1] !== 'xlsx') {
            this.setMessage('error', 'File should be in .xlsx format!');
          } else {
            const data = [];
            readXlsxFile(input.files[0]).then((rows) => {
              rows.forEach((row) => {
                data.push(...row);
              });

              const unique = [
                ...new Set(data.filter((d) => d !== 'PhoneNumber')),
              ];

              this.that.setState({
                recipients: unique,
                fileName: input.files[0].name,
              });
            });
          }

          break;

        case 'templateType':
          if (event.target.value === 'notemplate') {
            this.that.setState({
              messageBody: '',
              templateName: '',
              saveTemplate: false,
            });
          } else {
            this.that.setState({
              messageBody: event.target.value.split('#')[2],
              templateName: event.target.value.split('#')[1],
            });
          }

          break;

        case 'percentageShare':
          if (parseFloat(event.target.value).toFixed(2) < 0) {
            this.that.setState({
              percentageValid: false,
            });
          } else if (parseFloat(event.target.value).toFixed(2) > 100) {
            this.that.setState({
              percentageValid: false,
            });
          } else {
            this.that.setState({
              rate: event.target.value,
              percentageValid: true,
            });
          }

          break;

        case 'rate':
          if (parseFloat(event.target.value).toFixed(2) < 0) {
            this.that.setState({
              percentageValid: false,
            });
          } else if (parseFloat(event.target.value).toFixed(2) > 100) {
            this.that.setState({
              percentageValid: false,
            });
          } else {
            this.that.setState({
              rate: event.target.value,
              percentageValid: true,
            });
          }

          break;

        case 'contactEmail':
          if (event.target.value.length > 5) {
            this.that.setState({
              contactEmailValid: this.isEmail(event.target.value.trim()),
              contactEmail: event.target.value,
            });
          }

          break;
        case 'dateRange':
          switch (event.target.value) {
            case 'Today':
              this.that.setState({
                startDate: defineds.startOfToday,
                endDate: defineds.endOfToday,
              });
              break;
            case 'Yesterday':
              this.that.setState({
                startDate: defineds.startOfYesterday,
                endDate: defineds.endOfYesterday,
              });
              break;
            case 'This Week':
              this.that.setState({
                startDate: defineds.startOfWeek,
                endDate: defineds.endOfWeek,
              });
              break;
            case 'Last Week':
              this.that.setState({
                startDate: defineds.startOfLastWeek,
                endDate: defineds.endOfLastWeek,
              });
              break;
            case 'This Month':
              this.that.setState({
                startDate: defineds.startOfMonth,
                endDate: defineds.endOfMonth,
              });
              break;

            case 'Last Month':
              this.that.setState({
                startDate: defineds.startOfLastMonth,
                endDate: defineds.endOfLastMonth,
              });
              break;
            case 'This Year':
              this.that.setState({
                startDate: defineds.startOfYear,
                endDate: defineds.endOfYear,
              });
              break;
            case 'Last Year':
              this.that.setState({
                startDate: defineds.startOfLastYear,
                endDate: defineds.endOfLastYear,
              });
              break;
            default:
              this.that.setState({
                startDate: new Date(),
                endDate: new Date(),
              });
              break;
          }
          break;
        case 'investedAmount':
          this.that.state.interestRateDetails.forEach((item) => {
            if (
              parseInt(event.target.value.replace(/,/g, ''), 10)
                >= parseInt(item.lowerLimit, 10)
              && parseInt(event.target.value.replace(/,/g, ''), 10)
                <= parseInt(item.upperLimit, 10)
            ) {
              this.that.setState({
                rate: item.rate,
                monthlyInterest:
                  (item.rate
                    * parseInt(event.target.value.replace(/,/g, ''), 10))
                  / 100,
                annualProfit: item.rate * 12,
                investmentRateValid: true,
              });
            } else if (
              parseInt(event.target.value.replace(/,/g, ''), 10)
              < parseInt(item.lowerLimit, 10)
            ) {
              this.that.setState({
                investmentRateValid: false,
              });
            } else if (
              parseInt(event.target.value.replace(/,/g, ''), 10)
              > parseInt(item.upperLimit, 10)
            ) {
              this.that.setState({
                investmentRateValid: false,
              });
            } else {
              this.that.setState({
                investmentRateValid: false,
              });
            }
          });
          break;
        case 'term':
          if (this.that.state.investedAmount === '') {
            document.getElementById('investedAmount').classList.add('required');
          } else {
            this.that.setState({
              totalInterest:
                this.that.state.monthlyInterest * event.target.value,
            });
          }
          break;
        case 'smsRange':
          switch (event.target.value) {
            case 'Today':
              this.that.services.getFilteredSMSStats(
                defineds.startOfToday,
                defineds.endOfToday,
              );
              break;
            case 'Yesterday':
              this.that.services.getFilteredSMSStats(
                defineds.startOfYesterday,
                defineds.endOfYesterday,
              );
              break;
            case 'This Week':
              this.that.services.getFilteredSMSStats(
                defineds.startOfWeek,
                defineds.endOfWeek,
              );
              break;
            case 'Last Week':
              this.that.services.getFilteredSMSStats(
                defineds.startOfLastWeek,
                defineds.endOfLastWeek,
              );
              break;
            case 'This Month':
              this.that.services.getFilteredSMSStats(
                defineds.startOfMonth,
                defineds.endOfMonth,
              );
              break;
            case 'Last Month':
              this.that.services.getFilteredSMSStats(
                defineds.startOfLastMonth,
                defineds.endOfLastMonth,
              );
              break;
            case 'This Year':
              this.that.services.getFilteredSMSStats(
                defineds.startOfYear,
                defineds.endOfYear,
              );
              break;
            case 'Last Year':
              this.that.services.getFilteredSMSStats(
                defineds.startOfLastYear,
                defineds.endOfLastYear,
              );
              break;

            default:
              this.that.services.getFilteredSMSStats(
                defineds.startOfWeek,
                defineds.endOfWeek,
              );
              break;
          }
          break;

        case 'voiceRange':
          switch (event.target.value) {
            case 'Today':
              this.that.services.getFilteredVOICEStats(
                defineds.startOfToday,
                defineds.endOfToday,
              );
              break;
            case 'Yesterday':
              this.that.services.getFilteredVOICEStats(
                defineds.startOfYesterday,
                defineds.endOfYesterday,
              );
              break;
            case 'This Week':
              this.that.services.getFilteredVOICEStats(
                defineds.startOfWeek,
                defineds.endOfWeek,
              );
              break;
            case 'Last Week':
              this.that.services.getFilteredVOICEStats(
                defineds.startOfLastWeek,
                defineds.endOfLastWeek,
              );
              break;
            case 'This Month':
              this.that.services.getFilteredVOICEStats(
                defineds.startOfMonth,
                defineds.endOfMonth,
              );
              break;
            case 'Last Month':
              this.that.services.getFilteredVOICEStats(
                defineds.startOfLastMonth,
                defineds.endOfLastMonth,
              );
              break;
            case 'This Year':
              this.that.services.getFilteredVOICEStats(
                defineds.startOfYear,
                defineds.endOfYear,
              );
              break;
            case 'Last Year':
              this.that.services.getFilteredVOICEStats(
                defineds.startOfLastYear,
                defineds.endOfLastYear,
              );
              break;

            default:
              this.that.services.getFilteredVOICEStats(
                defineds.startOfWeek,
                defineds.endOfWeek,
              );
              break;
          }
          break;

        case 'date':
          this.that.setState({
            date: event.target.value,
          });
          this.that.services.getMessageStats(
            event.target.value,
            this.that.state.status,
          );

          break;
        case 'voiceDate':
          this.that.setState({
            date: event.target.value,
          });
          this.that.services.getVoiceStats(
            event.target.value,
            this.that.state.callStatus,
          );

          break;
        case 'allocationStatusFilter':
          this.that.setState({
            allocationStatusFilter: event.target.value,
          });
          this.that.services.getCustomerFollowUps(
            this.that.state.pageLimit,
            this.that.state.offset,
            event.target.value,
            this.that.state.searchTerm,
          );
          break;
        case 'arrearsAllocationStatus':
          this.that.setState({
            arrearsAllocationStatus: event.target.value,
          });
          if (parseInt(event.target.value, 10) === 1) {
            this.that.services.getEscalatedFollowUps(10, 0, '');
          } else {
            this.that.services.getLoanArrearsFollowUps();
          }
          break;
        case 'supportCompany':
          this.that.setState({
            supportCompany: event.target.value,
          });
          sessionStorage.setItem('companyId', event.target.value.split(',')[0]);
          sessionStorage.setItem('coreDB', event.target.value.split(',')[1]);
          sessionStorage.setItem('authDB', event.target.value.split(',')[2]);
          this.refresh();

          break;
        case 'searchTerm':
          if (event.target.value.length > 3) {
            this.that.setState(
              {
                searchTerm: event.target.value,
              },
              this.that.services.getCompanyCustomers(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          } else {
            this.that.setState(
              {
                searchTerm: event.target.value,
              },
              this.that.services.getCompanyCustomers(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          }

          break;
        case 'searchTermFollowUps':
          const criteria = JSON.parse(sessionStorage.getItem('filtersToApply')) === undefined || JSON.parse(sessionStorage.getItem('filtersToApply')) === null ? [] : JSON.parse(sessionStorage.getItem('filtersToApply'));
          if (event.target.value.length > 3) {
            this.that.setState(
              {
                searchTermFollowUps: event.target.value,
              },
              this.that.services.getFollowUpCases(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
                criteria,
              ),
            );
          } else {
            this.that.setState(
              {
                searchTermFollowUps: event.target.value,
              },
              this.that.services.getFollowUpCases(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
                criteria,
              ),
            );
          }

          break;
        case 'auditSearch':
          if (event.target.value.length > 3) {
            this.that.setState(
              {
                auditSearch: event.target.value,
              },
              this.that.services.getCompanyLogs(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          } else {
            this.that.setState(
              {
                leadsSearch: event.target.value,
              },
              this.that.services.getCompanyLogs(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          }

          break;

        case 'leadsSearch':
          if (event.target.value.length > 3) {
            this.that.setState(
              {
                leadsSearch: event.target.value,
              },
              this.that.services.getCompanyLeads(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          } else {
            this.that.setState(
              {
                leadsSearch: event.target.value,
              },
              this.that.services.getCompanyLeads(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          }

          break;
        case 'loanCustomerSearch':
          if (event.target.value.length > 3) {
            this.that.setState(
              {
                loanCustomerSearch: event.target.value,
              },
              this.that.services.getApprovedCustomers(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          } else {
            this.that.setState(
              {
                leadsSearch: event.target.value,
              },
              this.that.services.getApprovedCustomers(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          }

          break;
        case 'loanSearch':
          if (event.target.value.length > 3) {
            this.that.setState(
              {
                loanSearch: event.target.value,
              },
              this.that.services.getLoans(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          } else {
            this.that.setState(
              {
                loanSearch: event.target.value,
              },
              this.that.services.getLoans(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          }

          break;
        case 'loanApprovalSearch':
          if (event.target.value.length > 3) {
            this.that.setState(
              {
                loanApprovalSearch: event.target.value,
              },
              this.that.services.getLoanApprovals(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          } else {
            this.that.setState(
              {
                loanApprovalSearch: event.target.value,
              },
              this.that.services.getLoanApprovals(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          }

          break;
        case 'loanDisbursementSearch':
          if (event.target.value.length > 3) {
            this.that.setState(
              {
                loanDisbursementSearch: event.target.value,
              },
              this.that.services.getLoanDisbursements(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          } else {
            this.that.setState(
              {
                loanDisbursementSearch: event.target.value,
              },
              this.that.services.getLoanDisbursements(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
              ),
            );
          }

          break;
        case 'disbursementMethod':
          if (parseInt(event.target.value, 0) === 0
          && this.that.state.approvedCustomers.length > 0
          && this.that.state.customerId !== '') {
            const filteredCustomer = this.that.state.approvedCustomers.filter(
              (data) => data.id === this.that.state.customerId,
            );
            this.that.setState({
              [name]: target.value,
              beneficiaryAccountNumber: filteredCustomer.length > 0 ? filteredCustomer[0].mobileNumber : '',
            });
          } else {
            this.that.setState({
              [name]: target.value,
              beneficiaryAccountNumber: '',
            });
          }
          break;
        case 'marketSearch':
          if (event.target.value.length > 3) {
            this.that.setState(
              {
                marketSearch: event.target.value,
              },
              this.that.services.getMarkets(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
                'paginated',
              ),
            );
          } else {
            this.that.setState(
              {
                marketSearch: event.target.value,
              },
              this.that.services.getMarkets(
                this.that.state.pageLimit,
                this.that.state.offset,
                event.target.value,
                'paginated',
              ),
            );
          }

          break;
        case 'callResult':
          if (event.target.value === 'Unreachable') {
            this.that.setState({
              callStatusAction: 'Call Guarantor',
            });
          }
          break;
        case 'callStatusAction':
          if (event.target.value === 'Non-Commital') {
            this.that.setState({
              partyResponse: 'Call Guarantor',
            });
          } else if (event.target.value === 'Dispute') {
            this.that.setState({
              partyResponse: 'Call RO/Manager',
              thirdPartyResponse: 'Solve Dispute',
            });
          } else if (event.target.value === 'CallBack') {
            this.that.setState({
              partyResponse: 'Set Next Time and Date',
            });
          } else if (event.target.value === 'Promise to Pay') {
            this.that.setState({
              partyResponse: 'Set Agreement',
            });
          } else if (event.target.value === 'Line Busy') {
            this.that.setState({
              partyResponse: 'Call Back',
            });
          } else if (event.target.value === 'Hangup') {
            this.that.setState({
              partyResponse: 'Repeat Call',
            });
          }
          break;
        case 'partyResponse':
          if (event.target.value === 'Dispute') {
            this.that.setState({
              thirdPartyResponse: 'Call RO/Manager',
            });
          } else if (event.target.value === 'Unreachable') {
            this.that.setState({
              thirdPartyResponse: 'Visit Client',
            });
          }
          break;
        case 'thirdPartyResponse':
          if (event.target.value === 'Unreachable') {
            this.that.setState({
              thirdPartyAction: 'Visit Client',
            });
          } else if (event.target.value === 'Unsuccessful') {
            this.that.setState({
              thirdPartyAction: 'Visit Client',
            });
          }
          break;
        case 'thirdPartyAction':
          if (event.target.value === 'Agrees to Pay') {
            this.that.setState({
              nextSteps: 'Set Plan',
            });
          } else if (event.target.value === 'Refuses to Pay') {
            this.that.setState({
              nextSteps: 'Visit Client',
            });
          } else if (event.target.value === 'Unsuccessful') {
            this.that.setState({
              nextSteps: 'Visit Client',
            });
          }
          break;
        case 'nextSteps':
          if (event.target.value === 'Agrees to Pay') {
            this.that.setState({
              finalDecision: 'Set Plan',
            });
          } else if (event.target.value === 'Refuses to Pay') {
            this.that.setState({
              finalDecision: 'Visit Client',
            });
          }
          break;
        case 'dashboardBranch':
          this.that.setState({
            branchId: event.target.value,
          });
          this.that.services.getBranchDashboard(event.target.value);

          break;
        case 'targetBranchId':
          this.that.services.getBranchTargets(event.target.value);

          break;
        case 'dashboardRO':
          if (event.target.value === '') {
            if (window.location.href.split('/').pop() === 'credit-dashboard') {
              this.that.services.getCreditDashboard(
                this.that.state.hostBranchId,
              );
            } else {
              this.refresh();
            }
          } else {
            this.that.services.getRODashboard(event.target.value);
          }

          break;
        case 'dashboardCredit':
          this.that.setState({
            branchId:
              event.target.value !== '' ? event.target.value.split(',')[0] : '',
            hostBranchId:
              event.target.value !== ''
                ? event.target.value.split(',')[1].trim()
                : '',
          });

          this.that.services.getCreditDashboard(
            event.target.value !== ''
              ? event.target.value.split(',')[1].trim()
              : '',
          );

          break;
        case 'loanArrearsRoId':
          this.that.setState({
            loanArrearsRoId: event.target.value,
          });
          if (event.target.value !== '' && parseInt(sessionStorage.getItem('userType'), 10) === 5) {
            this.that.services.getLoanArrearsDashboard(
              sessionStorage.getItem('branchId'),
              event.target.value,
            );
          } else if (event.target.value !== '' && parseInt(sessionStorage.getItem('userType'), 10) === 3) {
            this.that.services.getLoanArrearsDashboard(
              this.that.state.loanArrearsBranchId,
              event.target.value,
            );
          }
          break;
        case 'loanArrearsBranchId':
          this.that.setState({
            loanArrearsBranchId: event.target.value,
          });
          if (event.target.value !== '' && parseInt(sessionStorage.getItem('userType'), 10) === 3) {
            this.that.services.getLoanArrearsDashboard(
              event.target.value,
              '',
            );
          }
          break;
        case 'followupAction':
          sessionStorage.setItem('currentCall', event.target.value);
          break;
        case 'dashboardCallAgent':
          this.that.services.getCallCentreDashboard(event.target.value);
          break;
        case 'callAgent':
          sessionStorage.setItem('callAgent', event.target.value);
          break;
        case 'customerFollowUpRO':
          sessionStorage.setItem('customerFollowUpRO', event.target.value);
          break;
        case 'customerFollowUpBranch':
          sessionStorage.setItem('customerFollowUpBranch', event.target.value);
          break;
        case 'kpiRange':
          this.clearInputs();
          switch (event.target.value) {
            case 'This Month':
              this.that.services.getKPIDetails(
                moment(defineds.startOfMonth).format('YYYY-MM-DD'),
                moment(defineds.endOfMonth).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              this.that.setState({
                startDate: moment(defineds.startOfMonth).format('YYYY-MM-DD'),
                endDate: moment(defineds.endOfMonth).format('YYYY-MM-DD'),
              });
              break;
            case 'Last Month':
              this.that.services.getKPIDetails(
                moment(defineds.startOfLastMonth).format('YYYY-MM-DD'),
                moment(defineds.endOfLastMonth).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              this.that.setState({
                startDate: moment(defineds.startOfLastMonth).format(
                  'YYYY-MM-DD',
                ),
                endDate: moment(defineds.endOfLastMonth).format('YYYY-MM-DD'),
              });
              break;
            case 'Next Month':
              this.that.services.getKPIDetails(
                moment(defineds.startOfNextMonth).format('YYYY-MM-DD'),
                moment(defineds.endOfNextMonth).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              this.that.setState({
                startDate: moment(defineds.startOfNextMonth).format(
                  'YYYY-MM-DD',
                ),
                endDate: moment(defineds.endOfNextMonth).format('YYYY-MM-DD'),
              });
              break;
            case 'This Quarter':
              this.that.services.getKPIDetails(
                moment(defineds.startOfQuarter).format('YYYY-MM-DD'),
                moment(defineds.endOfQuarter).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              this.that.setState({
                startDate: moment(defineds.startOfQuarter).format('YYYY-MM-DD'),
                endDate: moment(defineds.endOfQuarter).format('YYYY-MM-DD'),
              });
              break;
            case 'Last Quarter':
              this.that.services.getKPIDetails(
                moment(defineds.startOfLastQuarter).format('YYYY-MM-DD'),
                moment(defineds.endOfLastQuarter).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              this.that.setState({
                startDate: moment(defineds.startOfLastQuarter).format(
                  'YYYY-MM-DD',
                ),
                endDate: moment(defineds.endOfLastQuarter).format('YYYY-MM-DD'),
              });
              break;
            case 'Next Quarter':
              this.that.services.getKPIDetails(
                moment(defineds.startOfNextQuarter).format('YYYY-MM-DD'),
                moment(defineds.endOfNextQuarter).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              this.that.setState({
                startDate: moment(defineds.startOfNextQuarter).format(
                  'YYYY-MM-DD',
                ),
                endDate: moment(defineds.endOfNextQuarter).format('YYYY-MM-DD'),
              });
              break;

            case 'This Year':
              this.that.services.getKPIDetails(
                moment(defineds.startOfYear).format('YYYY-MM-DD'),
                moment(defineds.startOfYear).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              this.that.setState({
                startDate: moment(defineds.startOfYear).format('YYYY-MM-DD'),
                endDate: moment(defineds.startOfYear).format('YYYY-MM-DD'),
              });
              break;
            case 'Last Year':
              this.that.services.getKPIDetails(
                moment(defineds.startOfLastYear).format('YYYY-MM-DD'),
                moment(defineds.endOfLastYear).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              this.that.setState({
                startDate: moment(defineds.startOfLastYear).format(
                  'YYYY-MM-DD',
                ),
                endDate: moment(defineds.endOfLastYear).format('YYYY-MM-DD'),
              });
              break;
            case 'Next Year':
              this.that.services.getKPIDetails(
                moment(defineds.startOfNextYear).format('YYYY-MM-DD'),
                moment(defineds.endOfNextYear).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              this.that.setState({
                startDate: moment(defineds.startOfNextYear).format(
                  'YYYY-MM-DD',
                ),
                endDate: moment(defineds.endOfNextYear).format('YYYY-MM-DD'),
              });
              break;

            default:
              this.that.services.getKPIDetails(
                moment(defineds.startOfMonth).format('YYYY-MM-DD'),
                moment(defineds.endOfMonth).format('YYYY-MM-DD'),
                window.location.href.split('/').pop(),
              );
              break;
          }
          break;
        case 'duePTPRange':
          switch (event.target.value) {
            case 'Today':
              this.that.services.getDuePTPCases(
                defineds.startOfToday,
                defineds.endOfToday,
              );
              break;
            case 'Yesterday':
              this.that.services.getDuePTPCases(
                defineds.startOfYesterday,
                defineds.endOfYesterday,
              );
              break;
            case 'This Week':
              this.that.services.getDuePTPCases(
                defineds.startOfWeek,
                defineds.endOfWeek,
              );
              break;
            case 'Last Week':
              this.that.services.getDuePTPCases(
                defineds.startOfLastWeek,
                defineds.endOfLastWeek,
              );
              break;
            case 'This Month':
              this.that.services.getDuePTPCases(
                defineds.startOfMonth,
                defineds.endOfMonth,
              );
              break;
            case 'Last Month':
              this.that.services.getDuePTPCases(
                defineds.startOfLastMonth,
                defineds.endOfLastMonth,
              );
              break;
            case 'This Year':
              this.that.services.getDuePTPCases(
                defineds.startOfYear,
                defineds.endOfYear,
              );
              break;
            case 'Last Year':
              this.that.services.getDuePTPCases(
                defineds.startOfLastYear,
                defineds.endOfLastYear,
              );
              break;

            default:
              break;
          }
          break;
        case 'dueVisitsRange':
          switch (event.target.value) {
            case 'Today':
              this.that.services.getDueVisits(
                defineds.startOfToday,
                defineds.endOfToday,
              );
              break;
            case 'Yesterday':
              this.that.services.getDueVisits(
                defineds.startOfYesterday,
                defineds.endOfYesterday,
              );
              break;
            case 'This Week':
              this.that.services.getDueVisits(
                defineds.startOfWeek,
                defineds.endOfWeek,
              );
              break;
            case 'Last Week':
              this.that.services.getDueVisits(
                defineds.startOfLastWeek,
                defineds.endOfLastWeek,
              );
              break;
            case 'This Month':
              this.that.services.getDueVisits(
                defineds.startOfMonth,
                defineds.endOfMonth,
              );
              break;
            case 'Last Month':
              this.that.services.getDueVisits(
                defineds.startOfLastMonth,
                defineds.endOfLastMonth,
              );
              break;
            case 'This Year':
              this.that.services.getDueVisits(
                defineds.startOfYear,
                defineds.endOfYear,
              );
              break;
            case 'Last Year':
              this.that.services.getDueVisits(
                defineds.startOfLastYear,
                defineds.endOfLastYear,
              );
              break;

            default:
              break;
          }
          break;
        case 'customerIdNumber':
          if (event.target.value.length === 8) {
            this.that.services.checkCoreCustomer(event.target.value);
          }

          break;
        case 'reportTypeId':
          if (event.target.value === '0') {
            this.that.setState({
              parentReportId: '',
              reportName: '',
              reportPath: '',
            });
          } else if (event.target.value === '1') {
            this.that.setState({
              reportHeader: '',
            });
          } else {
            this.that.setState({
              parentReportId: '',
              reportName: '',
              reportPath: '',
              reportHeader: '',
            });
          }

          break;
        default:
          this.that.setState({
            [name]: target.value,
          });
          break;
      }
    }
  };

  refresh = () => {
    window.location.reload(false);
  };

  handleRefresh = (event, currentPath) => {
    if (currentPath === window.location.pathname) {
      window.location.reload();
    }
  };

  convertToPercentage(num1, num2) {
    if (num2 === 0 && num2 === 0) {
      return 0;
    }
    const result = (num1 / num2) * 100;
    return Math.round(result);
  }

  checkSetting(area) {
    // const companySettings = JSON.parse(sessionStorage.getItem('companySettings'));
    // if (companySettings.includes(area)) {
    //   return companySettings.filter((setting) => setting.description === area)[0].value;
    // }
    return 0;
  }

  handleClearState = () => {
    const initialState = {
      step: 1,
      isLoading: false,
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      messageType: '',
      templateName: '',
      scheduledDate: '',
      recipientType: '',
      messageBody: '',
      firstName: false,
      lastName: false,
      recipients: [],
      recipientExcel: '',
      customerInformation: [],
      templateType: '',
      saveTemplate: false,
      messagessArray: [],
      existingTemplate: '',
      branchId: '',
      loanOfficerId: '',
      endDays: '',
      startDays: '',
      fileName: '',
      recipient: '',
      apply: true,
      disable: false,
    };
    this.that.setState(initialState);
  };

  // handles checkboxes
  handleCheck = (event) => {
    const target = event.target;
    const name = target.name;
    this.that.setState({
      [name]: !this.that.state[name],
    });
  };

  handleFilterCheck = (e, value) => {
    let selected = [];
    if (!this.that.state.selected.includes(e.target.value)) {
      selected = this.that.state.selected.concat(e.target.value);
    } else {
      selected = this.that.state.selected.filter((a) => a !== e.target.value);
    }

    this.that.setState({ selected });
  };

  handleApply = (e, t) => {
    let criterias = this.that.state.criteria;
    const criteriaData = this.that.state.column === 'arrearsAmount'
      // || this.that.state.column === 'overdueDays'
      || this.that.state.column === 'modifiedDate'
      ? {
        title: `${this.that.state.column}`,
        condition: this.that.state.condition,
        fields: this.that.state.column === 'modifiedDate' ? [moment(this.that.state.startDate).format('YYYY-MM-DD'), moment(this.that.state.endDate).format('YYYY-MM-DD')] : [this.that.state.conditionValue],
      }
      : {
        title: `${this.that.state.column}`,
        fields: this.that.state.selected,
      };

    const criteria = criterias.filter(
      (item) => item.title === this.that.state.column,
    )[0];

    if (criteria === undefined) {
      criterias.push(criteriaData);
    } else {
      criterias = criterias.map((item) => {
        if (item.title === this.that.state.column) {
          return criteriaData;
        }
        return item;
      });
    }

    this.that.setState({
      criteria: criterias,
      showFilter: false,
    });

    const newCriterias = [];
    let id;
    let newData = {};
    criterias.forEach((data) => {
      switch (data.title) {
        case 'branch':
          const fields = [];
          data.fields.forEach((field) => {
            id = this.that.state.companyBranches.filter(
              (branch) => branch.name === field,
            )[0].hostBranchId;
            fields.push(id);
          });
          newData = {
            title: 'hostBranchId',
            fields,
          };
          break;
        case 'callAgent':
          const agentFields = [];
          data.fields.forEach((field) => {
            id = this.that.state.companyCallAgents.filter(
              (agent) => agent.firstName === field.split(' ')[0]
                && agent.lastName === field.split(' ')[1],
            )[0].id;
            agentFields.push(id);
          });
          newData = {
            title: 'allocatedUserId',
            fields: agentFields,
          };
          break;
        case 'recordStatus':
          const statuses = [];
          data.fields.forEach((field) => {
            id = this.that.state.enumerations.filter(
              (enumeration) => enumeration.key === 'PTPRecordStatus'
                && enumeration.description === field,
            )[0].value;
            statuses.push(id);
          });
          newData = {
            title: 'recordStatus',
            fields: statuses,
          };
          break;
        case 'paymentStatus':
          const payments = [];
          data.fields.forEach((field) => {
            id = this.that.state.enumerations.filter(
              (enumeration) => enumeration.key === 'CallCenterPaymentStatus'
                && enumeration.description === field,
            )[0].value;
            payments.push(id);
          });
          newData = {
            title: 'paymentStatus',
            fields: payments,
          };
          break;
        default:
          newData = data.title === 'arrearsAmount'
      // || data.title === 'overdueDays'
      || data.title === 'modifiedDate'
            ? {
              title: `${data.title}`,
              condition: this.that.state.condition,
              fields: data.title === 'modifiedDate' ? [moment(this.that.state.startDate).format('YYYY-MM-DD'), moment(this.that.state.endDate).format('YYYY-MM-DD')] : [this.that.state.conditionValue],
            }
            : {
              title: `${data.title}`,
              fields: this.that.state.selected,
            };
          break;
      }

      newCriterias.push(newData);
    });

    sessionStorage.setItem('criterias', JSON.stringify(criterias));
    sessionStorage.setItem('filtersToApply', JSON.stringify(newCriterias));
    const offset = parseInt(sessionStorage.getItem('FollowUpOffset'), 0) === 1 ? 0 : parseInt(sessionStorage.getItem('FollowUpOffset'), 0) * 10;
    this.that.services.getFollowUpCases(10, offset, '', newCriterias);
  };

  // handles empty inputs
  checkEmpty = (requiredFields) => {
    const empty = [];
    requiredFields.forEach((field) => (
      this.that.state[`${field}`] === '' || this.that.state[`${field}`] === null
        ? empty.push(field) : false));

    if (empty.length === 0) {
      return false;
    }
    this.setMessage(
      'error',
      "It appears there are required fields you haven't filled!",
    );

    empty.forEach((emptyField) => (emptyField === 'phoneNumber' || emptyField === 'mobileNumber'
      ? document
        .getElementsByClassName('react-tel-input')[0]
        .classList.add('mobile-required')
      : document.getElementById(`${emptyField}`).classList.add('required')));
    setTimeout(() => {
      this.that.setState({ error: false, errorMessage: '' });
      empty.forEach((emptyField) => (emptyField === 'phoneNumber' || emptyField === 'mobileNumber'
        ? document
          .getElementsByClassName('react-tel-input')[0]
          .classList.remove('mobile-required')
        : document
          .getElementById(`${emptyField}`)
          .classList.remove('required')));
    }, 8000);
    return true;
  };

  // handles input on focus
  handleFocus = (event) => {
    const target = event.target;
    const name = target.name;
    document.getElementById(`${name}`).classList.remove('required');
    this.that.setState({
      emptyFields: false,
      error: false,
      errorMessage: '',
    });
  };

  // sets alert messages to null or emnpty
  timeOut = (that) => {
    setTimeout(
      () => this.that.setState({
        error: false,
        errorMessage: '',
        success: false,
        successMessage: '',
      }),
      8000,
    );
  };

  // validates email input
  isEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRe.test(email);
  };

  // validates phone number
  isPhoneNumber = (number) => {
    // eslint-disable-next-line no-useless-escape
    const re = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    return re.test(number);
  };

  isPercentage = (number) => {
    // eslint-disable-next-line no-useless-escape
    const re = /^[0-9\b]+$/;
    return re.test(number);
  };

  // sets error or success message
  setMessage = (type, message) => {
    this.that.setState({
      error: type === 'error',
      errorMessage: type === 'error' ? message : '',
      success: type === 'success',
      successMessage: type === 'success' ? message : '',
      warning: type === 'warning',
      warningMessage: type === 'warning' ? message : '',
    });
    this.timeOut(this);
  };

  // toggles password field from password to text
  togglePassword = (special) => {
    if (document.getElementById(`${special}`).type === 'password') {
      this.that.setState({ [`show${special}`]: true });
    } else {
      this.that.setState({ [`show${special}`]: false });
    }
  };

  setIsLoading = (value) => {
    this.that.setState({
      isLoading: value === 'true',
    });
  };

  // function to populate fields
  populateFields = (that) => {
    // eslint-disable-next-line array-callback-return
    Object.keys(that.state).map((obj) => {
      for (const [key, value] of Object.entries(this.that.state.item)) {
        if (obj === key) {
          that.setState({
            [obj]: value === null ? '' : value,
          });
        } else if (key === 'id') {
          that.setState({ id: value === null ? '' : value });
        }
      }
    });
  };

  // Toggle side bar menu
  _onSideMenu = (active) => {
    this.that.setState({ sideMenu: active });
  };

  nextStep = () => {
    const { step } = this.that.state;
    this.that.setState({ step: step + 1 });
  };

  prevStep = () => {
    const { step } = this.that.state;
    this.that.setState({ step: step - 1 });
  };

  restValues = (values) => {
    this.that.setState({ ...values });
  };

  handleTab = (e, data) => {
    this.that.tabDisplay(parseInt(data, 10));
  };

  handleSubmit = (event, fields, special) => {
    window.scrollTo(0, 0);

    const roles = sessionStorage.getItem('userRoles') === null
      ? ''
      : sessionStorage.getItem('userRoles');

    if (this.checkEmpty(fields)) {
      return;
    }

    switch (special) {
      case 'saveMarket':
        this.that.submitForm();
        break;
      case 'savePayment':
        this.that.submitForm();
        break;
      case 'saveGeneralLedgerAccountMapping':
        this.that.submitForm();
        break;
      case 'saveApproval':
        this.that.submitForm();
        break;
      case 'submitDigitalLoans':
        this.that.submitForm();
        break;
      case 'submitCustomerData':
        this.that.submitForm();
        break;
      case 'saveLoanProduct':
        this.that.submitForm();
        break;
      case 'saveFee':
        this.that.submitForm();
        break;
      case 'savePenalty':
        this.that.submitForm();
        break;
      case 'saveLoanPurpose':
        this.that.submitForm();
        break;
      case 'saveLoan':
        if (this.that.state.disbursementMethod === '3'
            && this.that.state.bankBranchCode === '') {
          this.setMessage('error', 'Bank branch cannot be empty');
        } else {
          this.that.submitForm();
        }
        break;
      case 'fee':
        this.nextStep();
        this.restValues();

        break;
      case 'loanProductNext':
        if (parseFloat(this.that.state.minimumTerm.toString().replace(/,/g, ''))
        > parseFloat(this.that.state.maximumTerm.toString().replace(/,/g, ''))) {
          this.setMessage('error', 'Maximum term should be greater than minimum term!!');
        } else {
          this.nextStep();
          this.restValues();
        }

        break;
      case 'savingsProductNext':
        this.nextStep();
        this.restValues();

        break;
      case 'productsGraduatedScale':
        if (this.that.state.graduatedScales.length === 0) {
          this.setMessage('error', 'Graduated scale must be added!');
        } else {
          this.nextStep();
          this.restValues();
        }
        break;
      case 'loanProductChargesAndPenaltiesNext':
        this.nextStep();
        this.restValues();
        break;
      case 'feeGraduatedScale':
        if (this.that.state.feeGraduatedScales.length === 0) {
          this.setMessage('error', 'Graduated scale must be added');
        } else {
          this.nextStep();
          this.restValues();
        }
        break;
      case 'feeSplits':
        if (this.that.state.feeSplits.length === 0) {
          this.setMessage('error', 'Fee splits must be added!');
        } else if (this.feeSplitTotal(this.that.state.feeSplits, 0) !== 100) {
          this.setMessage('error', 'Fee splits total percentage must be 100%');
        } else {
          this.nextStep();
          this.restValues();
        }
        break;
      case 'companies':
        if (this.that.state.mobileAddress.length < 12) {
          this.setMessage('error', 'Mobile Number should be 12 digits!');
        } else {
          this.nextStep();
          this.restValues();
        }
        break;
      case 'settings':
        this.nextStep();
        this.restValues();

        break;
      case 'saveKpiCategory':
        this.that.submitForm();
        break;
      case 'uploadEmployees':
        this.that.submitForm();
        this.that.setState({
          modal1: false,
        });
        break;
      case 'uploadCheckOffs':
        this.that.submitForm();
        break;
      case 'approveEmployees':
        this.that.submitForm();
        break;
      case 'addRejectionReason':
        this.that.submitFormReject();
        this.that.setState({
          modal1: false,
        });
        break;
      case 'approveCheckOffs':
        this.that.submitForm();
        break;
      case 'rejectCheckOffs':
        this.that.submitFormReject();
        break;
      case 'user':
        if (this.that.state.contactMobile.length < 12) {
          this.setMessage('error', 'Mobile Number should be 12 digits!');
        } else {
          this.nextStep();
          this.restValues();
        }

        break;
      case 'completeCompany':
        if (
          this.that.state.contactMobile.length < 12
          || this.that.state.mobileAddress.length < 12
        ) {
          this.setMessage('error', 'Mobile Number should be 12 digits!');
        } else {
          this.that.submitForm();
        }
        break;
      case 'completeSubscription':
        this.that.submitForm();

        break;
      case 'saveSMSTemplate':
        if (
          roles.includes('Can Create Message Template')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'saveChartOfAccount':
        if (
          roles.includes('Can Create Account')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;

      case 'saveCustomerAccount':
        if (
          roles.includes('Can Create Customer Account')
            || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;

      case 'saveJournalEntry':
        if (
          roles.includes('Can Create Account')
            || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;

      case 'saveRejectionReason':
        if (
          roles.includes('Settings')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'savePasswordPolicy':
        if (
          roles.includes('Settings')
            || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'subscription':
        this.nextStep();
        this.restValues();

        break;
      case 'saveModules':
        this.that.submitForm();

        break;
      case 'saveConfiguration':
        this.that.submitForm();

        break;

      case 'addBeneficiaryRow':
        const beneficiaries = this.that.state.beneficiary;
        const percentage = [];
        beneficiaries.forEach((pshare) => {
          percentage.push(pshare.percentageShare);
        });
        const percentageSum = percentage.reduce((a, b) => a + b, 0);
        if (percentageSum > 100) {
          this.setMessage(
            'error',
            'Sum of percentage share should not be greater than 100',
          );
        } else {
          if (this.that.state.phoneNumber.length < 12) {
            this.setMessage('error', 'Mobile Number should be 12 digits!');
          } else {
            this.that.handleAdd('addBeneficiary');
          }
        }

        break;
      case 'addAgent':
        this.that.props.handleAdd('addAgent');
        break;
      case 'addInterestBand':
        this.that.handleAdd('addInterestBands');
        break;
      case 'addChargeScale':
        if (
          parseInt(this.that.state.lowerLimit.replace(/,/g, ''), 10)
          > parseInt(this.that.state.upperLimit.replace(/,/g, ''), 10)
        ) {
          this.setMessage(
            'error',
            'Upper limit should be greater than the lower limit!',
          );
        } else {
          this.that.handleAdd('add');
        }
        break;
      case 'addNextOfKin':
        if (this.that.state.nMobileNumber.length < 12) {
          this.setMessage('error', 'Mobile Number should be 12 digits!');
        } else {
          this.handleAdd(event, 'addNextOfKin');
        }
        break;
      case 'addReportParameter':
        if (this.that.state.userTypes.length === 0) {
          this.setMessage('error', 'Select at least one user type!');
        } else {
          this.handleAdd(event, 'addReportParameter');
        }

        break;
      case 'addGuarantor':
        const memberNo = String(this.that.state.mobileNumber).charAt(0) === '+'
          ? this.that.state.mobileNumber
          : `+${this.that.state.mobileNumber}`;
        const guarantorPhone = String(this.that.state.gMobileNumber).charAt(0) === '+'
          ? this.that.state.gMobileNumber
          : `+${this.that.state.gMobileNumber}`;
        if (
          parseInt(this.that.state.gIdType, 10) === 0
          && this.that.state.gIdNumber.length < 7
        ) {
          this.setMessage(
            'error',
            'ID Number should not be less than 7 digits!',
          );
        } else {
          if (this.that.state.gMobileNumber.length < 12) {
            this.setMessage('error', 'Mobile Number should be 12 digits!');
          } else {
            if (
              guarantorPhone === memberNo
              || this.that.state.idNumber === this.that.state.gIdNumber
            ) {
              this.setMessage('error', 'A customer can not self-guarantee!');
            } else {
              this.handleAdd(event, 'addGuarantor');
            }
          }
        }

        break;
      case 'editChargeScale':
        if (
          parseInt(this.that.state.lowerLimit.replace(/,/g, ''), 10)
          > parseInt(this.that.state.upperLimit.replace(/,/g, ''), 10)
        ) {
          this.setMessage(
            'error',
            'Upper limit should be greater than the lower limit!',
          );
        } else {
          this.that.handleAdd('editChargeScale');
        }
        break;
      case 'filterOutbox':
        if (
          roles.includes('Can View Messages')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            this.that.state.recipient === ''
            && this.that.state.status === ''
            && this.that.state.startDate === ''
            && this.that.state.endDate === ''
          ) {
            this.setMessage(
              'error',
              'Select at least one criteria to filter the results!',
            );
          } else {
            if (this.that.state.recipient.length < 12) {
              this.setMessage(
                'error',
                'Mobile Number should be 12 digits in length!',
              );
            } else {
              this.that.services.getFilteredOutbox();
            }
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'filterReport':
        sessionStorage.removeItem('reportPath');
        if (
          roles.includes('Can View Report')
            || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          const expectedParameters = this.that.state.reportParams.filter((param) => param.parameterUsers.includes(parseInt(sessionStorage.getItem('userType'))));

          const parameterList = [];
          let item;

          expectedParameters.forEach((parameter) => {
            switch (parseInt(parameter.parameterType)) {
              case 1:
                item = `${parameter.parameterName}${this.that.state.hostBranchId === '' ? parseInt(parameter.parameterAction, 10) === 1 ? ':isnull=true' : parseInt(parameter.parameterAction, 10) === 2 ? '=""' : parseInt(parameter.parameterAction, 10) === 4 ? `=${sessionStorage.getItem('defaultHostBranchId')}` : `=${this.that.state.hostBranchId}` : `=${this.that.state.hostBranchId}`}`;
                if (parameter.parameterAction !== 3) {
                  parameterList.push(item);
                }

                break;
              case 2:
                item = `${parameter.parameterName}${this.that.state.hostBranchCode === '' ? parseInt(parameter.parameterAction, 10) === 1 ? ':isnull=true' : parseInt(parameter.parameterAction, 10) === 2 ? '=""' : parseInt(parameter.parameterAction, 10) === 4 ? `=${sessionStorage.getItem('defaultHostBranchCode')}` : `=${this.that.state.hostBranchCode}` : `=${this.that.state.hostBranchCode}`}`;
                if (parameter.parameterAction !== 3) {
                  parameterList.push(item);
                }

                break;
              case 3:
                item = `${parameter.parameterName}${this.that.state.relationshipOfficerId === '' ? parseInt(parameter.parameterAction, 10) === 1 ? ':isnull=true' : parseInt(parameter.parameterAction, 10) === 2 ? '=""' : parseInt(parameter.parameterAction, 10) === 4 ? `=${sessionStorage.getItem('relationshipOfficerId')}` : `=${this.that.state.relationshipOfficerId}` : `=${this.that.state.relationshipOfficerId}`}`;
                if (parameter.parameterAction !== 3) {
                  parameterList.push(item);
                }

                break;
              case 5:
                switch (parameter.parameterName) {
                  case 'StartDate':
                    const date1 = `${parameter.parameterName}${this.that.state.startDate === '' ? parseInt(parameter.parameterAction, 10) === 1 ? ':isnull=true' : parseInt(parameter.parameterAction, 10) === 2 ? '=""' : parseInt(parameter.parameterAction, 10) === 4 ? `=${moment(new Date()).format('YYYY-MM-DD')}` : `=${moment(this.that.state.startDate).format('YYYY-MM-DD')}` : `=${moment(this.that.state.startDate).format('YYYY-MM-DD')}`}`;
                    if (parameter.parameterAction !== 3) {
                      parameterList.push(date1);
                    }
                    break;
                  case 'EndDate':
                    const date2 = `${parameter.parameterName}${this.that.state.endDate === '' ? parseInt(parameter.parameterAction, 10) === 1 ? ':isnull=true' : parseInt(parameter.parameterAction, 10) === 2 ? '=""' : parseInt(parameter.parameterAction, 10) === 4 ? `=${moment(new Date()).format('YYYY-MM-DD')}` : `=${moment(this.that.state.endDate).format('YYYY-MM-DD')}` : `=${moment(this.that.state.endDate).format('YYYY-MM-DD')}`}`;
                    if (parameter.parameterAction !== 3) {
                      parameterList.push(date2);
                    }
                    break;
                  default:
                    break;
                }
                break;

              case 6:
                item = `${parameter.parameterName}${this.that.state.enumeration === '' ? parseInt(parameter.parameterAction, 10) === 1 ? ':isnull=true' : parseInt(parameter.parameterAction, 10) === 2 ? '=""' : parseInt(parameter.parameterAction, 10) === 4 ? '=\'\'' : `=${this.that.state.enumeration}` : `=${this.that.state.enumeration}`}`;
                if (parameter.parameterAction !== 3) {
                  parameterList.push(item);
                }

                break;
              case 7:
                item = `${parameter.parameterName}${this.that.state.fieldValue === '' ? parseInt(parameter.parameterAction, 10) === 1 ? ':isnull=true' : parseInt(parameter.parameterAction, 10) === 2 ? '=""' : parseInt(parameter.parameterAction, 10) === 4 ? `=${sessionStorage.getItem('relationshipOfficerId')}` : `=${this.that.state.fieldValue}` : `=${this.that.state.fieldValue}`}`;
                if (parameter.parameterAction !== 3) {
                  parameterList.push(item);
                }

                break;
              default:
                break;
            }
          });

          const ipAddress = JSON.parse(sessionStorage.getItem('companySettings')).filter((i) => i.description === 'STATIC_IP_ADDRESS')[0].value;
          const joinedParams = parameterList.join('&');
          const path = `${ipAddress}${this.that.state.path}&rc:Toolbar=${this.that.state.allowToolbar}&${joinedParams}`;

          sessionStorage.setItem('reportPath', path);

          this.that.setState({
            reportPath: path,
          });
        } else {
          this.that.props.history.push('/app/403');
        }
        break;

      case 'filterPayments':
        if (
          this.that.state.startDate === ''
          && this.that.state.endDate === ''
        ) {
          this.setMessage(
            'error',
            'Select at least one criteria to filter the payments!',
          );
        } else {
          this.that.services.getFilteredPayments();
        }

        break;
      case 'personalInformation':
        if (roles.includes('Can Update Investor Profile')) {
          if (
            parseInt(this.that.state.idType, 10) === 0
            && this.that.state.idNumber.length < 7
          ) {
            this.setMessage(
              'error',
              'ID Number should not be less than 7 digits!',
            );
          } else {
            if (this.that.state.mobilePhoneNumber.length < 12) {
              this.setMessage('error', 'Mobile Number should be 12 digits!');
            } else {
              this.nextStep();
              this.restValues();
            }
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'location':
        if (roles.includes('Can Update Investor Profile')) {
          this.nextStep();
          this.restValues();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'profession':
        if (roles.includes('Can Update Investor Profile')) {
          this.nextStep();
          this.restValues();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'settlements':
        if (roles.includes('Can Update Investor Profile')) {
          this.nextStep();
          this.restValues();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;

      case 'editLoanLimit':
        if (roles.includes('Can Create Limit Adjustment')) {
          if (this.that.state.limitPhoneNumber.length < 12) {
            this.setMessage('error', 'Mobile Number should be 12 digits!');
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'editLockStatus':
        if (
          roles.includes('Can Create Limit Adjustment')
          || roles.includes('Can Approve Lock Status Change')
        ) {
          if (this.that.state.limitPhoneNumber.length < 12) {
            this.setMessage('error', 'Mobile Number should be 12 digits!');
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'approveLimit':
        if (roles.includes('Can Approve Loan Limit')) {
          this.that.services.verifyLoanLimits(special);
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'rejectLimit':
        if (roles.includes('Can Approve Loan Limit')) {
          this.that.services.verifyLoanLimits(special);
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'beneficiaries':
        if (roles.includes('Can Update Investor Profile')) {
          if (this.that.state.beneficiary.length === 0) {
            const data = [];
            data.push(this.that.state.beneficiary);
            this.that.setState({
              beneficiary: data,
            });
            this.nextStep();
            this.restValues();
          } else {
            this.nextStep();
            this.restValues();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'completeInvestorProfile':
        if (roles.includes('Can Update Investor Profile')) {
          if (
            parseInt(this.that.state.idType, 10) === 0
            && this.that.state.idNumber.length < 7
          ) {
            this.setMessage(
              'error',
              'ID Number should not be less than 7 digits!',
            );
          } else {
            if (this.that.state.mobilePhoneNumber.length < 12) {
              this.setMessage('error', 'Mobile Number should be 12 digits!');
            } else {
              this.that.submitForm();
            }
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'basicInvestor':
        if (roles.includes('Can Create Investor')) {
          if (this.that.state.mobilePhoneNumber.length < 12) {
            this.setMessage('error', 'Mobile Number should be 12 digits!');
          } else {
            this.nextStep();
            this.restValues();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'createInvestor':
        if (roles.includes('Can Create Investor')) {
          if (this.that.state.mobilePhoneNumber.length < 12) {
            this.setMessage('error', 'Mobile Number should be 12 digits!');
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'updateInvestor':
        if (roles.includes('Can Update Investor')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'editInvestorProfile':
        if (roles.includes('Can Update Investor Profile')) {
          if (
            parseInt(this.that.state.idType, 10) === 0
            && this.that.state.idNumber.length < 7
          ) {
            this.setMessage(
              'error',
              'ID Number should not be less than 7 digits!',
            );
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'investment':
        if (roles.includes('Can Create Investment')) {
          this.nextStep();
          this.restValues();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'completeInvestment':
        if (roles.includes('Can Create Investment')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'visitNote':
        if (roles.includes('Can View Disbursements')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'loanArrearsNote':
        if (roles.includes('Can View Arrears Visit Notes')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'updateInvestment':
        if (roles.includes('Can Update Investment')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'approveInvestment':
        if (roles.includes('Can Approve Investment')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'generateSettlement':
        if (roles.includes('Can Update Investor Settlements')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'interestRateBand':
        if (roles.includes('Can Create Interest Rate Band')) {
          if (this.that.state.interestBands.length === 0) {
            const data = [];
            data.push(this.that.state.interestBands);
            this.that.setState({
              interestBands: data,
            });
            this.nextStep();
            this.restValues();
          } else {
            this.nextStep();
            this.restValues();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'createInterestRateBand':
        if (roles.includes('Can Create Interest Rate Band')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'updateInterestRateBand':
        if (roles.includes('Can Update Interest Rate Band')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'saveBranch':
        if (
          roles.includes('Can Create Branch')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }

        break;
      case 'updateBranch':
        if (
          roles.includes('Can Update Company Branch')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }

        break;
      case 'addLimitScale':
        if (
          parseInt(this.that.state.lowerLimit.replace(/,/g, ''), 10)
          > parseInt(this.that.state.upperLimit.replace(/,/g, ''), 10)
        ) {
          this.setMessage(
            'error',
            'Upper limit should be greater than the lower limit!',
          );
        } else {
          this.that.handleAdd('add');
        }
        break;
      case 'saveLimitRule':
        if (
          roles.includes('Can Create Limit Rule')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            parseInt(this.that.state.minimumAmount, 10)
            > parseInt(this.that.state.maximumAmount, 10)
          ) {
            this.setMessage(
              'error',
              'Upper limit should be greater than the lower limit!',
            );
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }

        break;
      case 'updateLimitRule':
        if (
          roles.includes('Can Update Limit Rule')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            parseInt(this.that.state.minimumAmount, 10)
            > parseInt(this.that.state.maximumAmount, 10)
          ) {
            this.setMessage(
              'error',
              'Upper limit should be greater than the lower limit!',
            );
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }

        break;
      case 'saveScoringRule':
        if (
          roles.includes('Can Create Limit Rule')
            || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            parseFloat(this.that.state.minimumAmount.toString().replace(/,/g, ''))
              > parseFloat(this.that.state.maximumAmount.toString().replace(/,/g, ''))
          ) {
            this.setMessage(
              'error',
              'Maximum amount should be greater than minimum amount!',
            );
          } else if (
            parseFloat(this.that.state.appraisalRatingStart, 10)
              > parseFloat(this.that.state.appraisalRatingEnd, 10)
          ) {
            this.setMessage(
              'error',
              'Appraisal rating end should be greater than appraisal rating start!',
            );
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'updateScoringRule':
        if (
          roles.includes('Can Update Limit Rule')
            || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            parseInt(this.that.state.minimumDepositAmount, 10)
              > parseInt(this.that.state.maximumDepositAmount, 10)
          ) {
            this.setMessage(
              'error',
              'Maximum deposit should be greater than minimum deposit!',
            );
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'addScoringProductRule':
        this.that.handleAdd('add');
        break;
      case 'addFeeGraduatedScale':
        const feeGraduatedScale = this.that.state.feeGraduatedScales.length > 0 ? this.that.state.feeGraduatedScales.filter(
          (data) => parseFloat(data.upperLimit.toString().replace(/,/g, '')) >= parseFloat(this.that.state.lowerLimit.toString().replace(/,/g, ''))
          && parseFloat(data.lowerLimit.toString().replace(/,/g, '')) <= parseFloat(this.that.state.upperLimit.toString().replace(/,/g, '')),
        ) : [];
        if (
          parseFloat(this.that.state.lowerLimit.toString().replace(/,/g, ''))
            > parseFloat(this.that.state.upperLimit.toString().replace(/,/g, ''))
        ) {
          this.setMessage(
            'error',
            'Upper limit should be greater than lower limit',
          );
        } else if (!this.isNumber(this.that.state.value)) {
          this.setMessage(
            'error',
            'Value must be a number!',
          );
        } else if (
          feeGraduatedScale.length > 0
        ) {
          this.setMessage(
            'error',
            'Limit range provided overlaps with another range.',
          );
        } else {
          this.handleAdd(event, 'feeGraduatedScaleAdd');
        }
        break;
      case 'addFeeSplit':
        if (
          parseFloat(this.that.state.percentage) > 100
          || parseFloat(this.that.state.percentage) < 0
        ) {
          this.setMessage(
            'error',
            'Percentage cannot be less than 0% or greater than 100%',
          );
        } else if (
          this.that.state.feeSplits.length > 0
          && this.feeSplitTotal(this.that.state.feeSplits, this.that.state.percentage) > 100
        ) {
          this.setMessage(
            'error',
            'Percentage total cannot be greater than 100%',
          );
        } else {
          this.handleAdd(event, 'feeSplitAdd');
        }
        break;
      case 'addProductGraduatedScale':
        const graduatedScale = this.that.state.graduatedScales.length > 0 ? this.that.state.graduatedScales.filter(
          (data) => parseFloat(data.maximumAmount.toString().replace(/,/g, '')) >= parseFloat(this.that.state.minimumAmount.toString().replace(/,/g, ''))
          && parseFloat(data.minimumAmount.toString().replace(/,/g, '')) <= parseFloat(this.that.state.maximumAmount.toString().replace(/,/g, '')),
        ) : [];
        if (
          parseFloat(this.that.state.minimumAmount.toString().replace(/,/g, ''))
              > parseFloat(this.that.state.maximumAmount.toString().replace(/,/g, ''))
        ) {
          this.setMessage(
            'error',
            'Maximum amount should be greater than minimum amount',
          );
        } else if (
          graduatedScale.length > 0
        ) {
          this.setMessage(
            'error',
            'The amount range provided overlaps with another range.',
          );
        } else {
          this.handleAdd(event, 'productGraduatedScaleAdd');
        }
        break;
      case 'saveUser':
        if (
          roles.includes('Can Create User')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (this.that.state.contactMobile.length < 12) {
            this.setMessage('error', 'Mobile Number should be 12 digits!');
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'supportUser':
        if (this.that.state.contactMobile.length < 12) {
          this.setMessage('error', 'Mobile Number should be 12 digits!');
        } else {
          this.that.submitForm();
        }

        break;
      case 'updateUser':
        if (
          roles.includes('Can Update User')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (this.that.state.contactMobile.length < 12) {
            this.setMessage('error', 'Mobile Number should be 12 digits!');
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'saveRole':
        if (
          parseInt(sessionStorage.getItem('userType'), 10) === 1
          || parseInt(sessionStorage.getItem('userType'), 10) === 4
        ) {
          if (this.that.state.selectedIds.length === 0) {
            this.setMessage('error', 'Select a module for the Role');
          } else {
            this.that.submitForm();
          }
        } else {
          if (roles.includes('Can Create Role')) {
            if (this.that.state.selectedIds.length === 0) {
              this.setMessage('error', 'Select a module for the Role');
            } else {
              this.that.submitForm();
            }
          } else {
            this.that.props.history.push('/app/403');
          }
        }
        break;
      case 'updateRole':
        if (
          parseInt(sessionStorage.getItem('userType'), 10) === 1
          || parseInt(sessionStorage.getItem('userType'), 10) === 4
        ) {
          if (this.that.state.selectedIds.length === 0) {
            this.setMessage('error', 'Select a module for the Role');
          } else {
            this.that.submitForm();
          }
        } else {
          if (roles.includes('Can Update Role')) {
            if (this.that.state.selectedIds.length === 0) {
              this.setMessage('error', 'Select a module for the Role');
            } else {
              this.that.submitForm();
            }
          } else {
            this.that.props.history.push('/app/403');
          }
        }
        break;
      case 'saveReport':
        if (
          roles.includes('Can Create Report')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'updateReport':
        if (
          roles.includes('Can Update Report')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'saveRegion':
        this.that.submitForm();

        break;
      case 'saveCharge':
        this.that.submitForm('saveCharge');

        break;
      case 'updateCharge':
        this.that.submitForm('updateCharge');

        break;
      case 'saveScheduledMessage':
        if (
          roles.includes('Can Create Message')
            || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }

        break;

      case 'sendSMS':
        if (
          roles.includes('Can Create Message')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }

        break;
      case 'sendCallCentreBulkSMS':
        if (
          roles.includes('Can Create Message')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;

      case 'saveCompose':
        if (
          roles.includes('Can Create Message')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          const messages = [];
          const messagesArray = [];
          if (this.that.state.customerInformation.length > 0) {
            this.that.state.customerInformation.forEach((customer) => {
              let myMessage = this.that.state.messageBody;
              const replaceArray = this.that.state.availableFields;

              const mapping = {};
              replaceArray.forEach(
                (e, i) => (mapping[`{${e}}`] = customer[`${e}`]),
              );

              const re = /\{.*\}/;
              myMessage = re.test(myMessage)
                ? myMessage.replace(/\{\w+\}/gi, (n) => mapping[n])
                : this.that.state.messageBody;
              messages.push(myMessage);

              const arr = {
                companyId: sessionStorage.getItem('companyId'),
                recipient: customer.PhoneNumber,
                charCount: myMessage.length,
                messageBody: myMessage,
                status: 0,
                isCoreMessage: 0,
                createdBy: sessionStorage.getItem('userId'),
                scheduledDate:
                  parseInt(this.that.state.messageType, 10) === 1
                    ? new Date().toLocaleString()
                    : this.that.state.scheduledDate,
                messageType: 1,
              };

              messagesArray.push(arr);

              this.that.setState({
                messages,
                previewMessage: messages[0],
                messagesArray,
              });
            });
            this.nextStep();
            this.restValues();
          } else {
            const re = /\{.*\}/;
            if (re.test(this.that.state.messageBody)) {
              this.setMessage('error', 'Use a template that has no variables!');
            } else {
              this.that.state.recipients.forEach((recipient) => {
                const myMessage = this.that.state.messageBody;
                const arr = {
                  companyId: sessionStorage.getItem('companyId'),
                  recipient,
                  charCount: myMessage.length,
                  messageBody: myMessage,
                  status: 0,
                  isCoreMessage: 0,
                  createdBy: sessionStorage.getItem('userId'),
                  scheduledDate:
                    parseInt(this.that.state.messageType, 10) === 1
                      ? new Date().toLocaleString()
                      : this.that.state.scheduledDate,
                };

                messagesArray.push(arr);
                messages.push(myMessage);

                this.that.setState({
                  messages,
                  previewMessage: messages[0],
                  messagesArray,
                });
              });
              this.nextStep();
              this.restValues();
            }
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'saveSMSRecipients':
        if (
          roles.includes('Can Create Message')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.setState({
            disable: true,
          });
          if (
            parseInt(this.that.state.recipientType, 10) === 3
            || parseInt(this.that.state.recipientType, 10) === 2
          ) {
            if (this.that.state.recipients.length === 0) {
              if (this.that.state.recipient === '') {
                const message = parseInt(this.that.state.recipientType, 10) === 3
                  ? "Ensure you input at least one recipient's number"
                  : 'Ensure the excel file has valid phone numbers!';
                this.setMessage('error', message);
              } else {
                const data = [];
                data.push(this.that.state.recipient);
                this.that.setState({
                  recipients: data,
                  disable: true,
                });
                this.nextStep();
                this.restValues();
              }
            } else {
              this.nextStep();
              this.restValues();
            }
          } else {
            const data = {
              allClients:
                parseInt(this.that.state.recipientType, 10) === 1
                || parseInt(this.that.state.recipientType, 10) === 3
                || parseInt(this.that.state.recipientType, 10) === 2
                  ? 1
                  : 0,
              branch:
                this.that.state.branchId === 'All'
                  ? ''
                  : this.that.state.branchId,
              loanOfficer:
                this.that.state.loanOfficerId === 'All'
                  ? ''
                  : this.that.state.loanOfficerId,

              isActive: 1,
              inArrears:
                parseInt(this.that.state.recipientType, 10) === 4 ? 1 : 0,
              startDays:
                parseInt(this.that.state.recipientType, 10) === 4
                  ? this.that.state.startDays
                  : 0,
              endDays:
                parseInt(this.that.state.recipientType, 10) === 4
                  ? this.that.state.endDays
                  : 0,
            };
            this.that.services.getSMSFields(data);
          }
        } else {
          this.that.props.history.push('/app/403');
        }

        break;
      case 'saveCallCenterComposeSMS':
        if (
          roles.includes('Can Create Message')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          const messages = [];
          const messagesArray = [];
          if (this.that.state.customerInformation.length > 0) {
            this.that.state.customerInformation.forEach((customer) => {
              let myMessage = this.that.state.messageBody;
              const customerInformation = {
                CustomerFirstName: customer.CustomerFirstName,
                CustomerLastName: customer.CustomerLastName,
                CustomerName: customer.CustomerName,
                PhoneNumber: customer.PhoneNumber,
                ArrearsAmount:
                  customer.ArrearsAmount === ''
                  || customer.ArrearsAmount === null
                  || customer.ArrearsAmount === undefined
                    ? customer.ArrearsAmount
                    : customer.ArrearsAmount.toLocaleString(),
                OverDueDays: customer.OverDueDays,
                PTPAmount:
                  customer.PTPAmount === ''
                  || customer.PTPAmount === null
                  || customer.PTPAmount === undefined
                    ? customer.PTPAmount
                    : customer.PTPAmount.toLocaleString(),
                PTPDate:
                  customer.PTPDate === ''
                  || customer.PTPDate === null
                  || customer.PTPDate === undefined
                    ? customer.PTPDate
                    : moment(customer.PTPDate).format('DD-MMM-YYYY'),
              };
              const replaceArray = Object.keys(customerInformation);

              const mapping = {};
              replaceArray.forEach(
                (e, i) => (mapping[`{${e}}`] = customerInformation[`${e}`]),
              );

              const re = /\{.*\}/;
              myMessage = re.test(myMessage)
                ? myMessage.replace(/\{\w+\}/gi, (n) => mapping[n])
                : this.that.state.messageBody;
              messages.push(myMessage);

              const arr = {
                companyId: sessionStorage.getItem('companyId'),
                recipient: customer.PhoneNumber,
                charCount: myMessage.length,
                messageBody: myMessage,
                status: 0,
                isCoreMessage: 0,
                createdBy: sessionStorage.getItem('userId'),
                scheduledDate:
                  parseInt(this.that.state.messageType, 10) === 1
                    ? new Date().toLocaleString()
                    : new Date(this.that.state.scheduledDate).toLocaleString(),
                messageType: 1,
              };

              messagesArray.push(arr);

              this.that.setState({
                messages,
                previewMessage: messages[0],
                messagesArray,
              });
            });
          } else {
            this.that.state.recipients.forEach((recipient) => {
              const myMessage = this.that.state.messageBody;
              const arr = {
                companyId: sessionStorage.getItem('companyId'),
                recipient,
                charCount: myMessage.length,
                messageBody: myMessage,
                status: 0,
                isCoreMessage: 0,
                createdBy: sessionStorage.getItem('userId'),
                scheduledDate:
                  parseInt(this.that.state.messageType, 10) === 1
                    ? new Date().toLocaleString()
                    : new Date(this.that.state.scheduledDate).toLocaleString(),
              };

              messagesArray.push(arr);
              messages.push(myMessage);

              this.that.setState({
                messages,
                previewMessage: messages[0],
                messagesArray,
              });
            });
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        this.nextStep();
        this.restValues();
        break;
      case 'saveCallCentreSMS':
        if (
          roles.includes('Can Create Message')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          const data = {
            branch:
              this.that.state.branchId === 'All'
              || parseInt(this.that.state.recipientType, 10) === 6
                ? ''
                : this.that.state.branchId,
            isPTP: parseInt(this.that.state.recipientType, 10) === 6 ? 1 : 0,
            allClients:
              parseInt(this.that.state.recipientType, 10) === 5 ? 1 : 0,
            startDays:
              parseInt(this.that.state.recipientType, 10) === 5
                ? this.that.state.startDays
                : 0,
            endDays:
              parseInt(this.that.state.recipientType, 10) === 5
                ? this.that.state.endDays
                : 0,
            ptpStart:
              this.that.state.ptpStart === ''
                ? ''
                : moment(this.that.state.ptpStart).format('YYYY-MM-DD'),
            ptpEnd:
              this.that.state.ptpEnd === ''
                ? ''
                : moment(this.that.state.ptpEnd).format('YYYY-MM-DD'),
          };
          this.that.services.getCallCentreSMSFields(data);
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'updatePreferences':
        if (
          roles.includes('Can Update Subscription Preferences')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }

        break;
      case 'marketingLeads':
        if (
          roles.includes('Can Update Marketing Lead')
          || roles.includes('Can Create Marketing Lead')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            parseInt(this.that.state.idType, 10) === 0
            && this.that.state.idNumber.length < 7
          ) {
            this.setMessage(
              'error',
              'ID Number should not be less than 7 digits!',
            );
          } else {
            if (this.that.state.customerPhoneNumber.length < 12) {
              this.setMessage('error', 'Mobile Number should be 12 digits!');
            } else {
              this.that.submitForm();
            }
          }
        } else {
          this.that.props.history.push('/app/403');
        }

        break;
      case 'uploadMpesaStatement':
        const fileInput = document.getElementById('mpesaStatementFile');

        if (this.that.state.customerIdNumber === '') {
          this.setMessage('error', 'Customer must have an ID Number!');
        } else if (this.that.state.mpesaStatementFile !== ''
          && fileInput.files[0].name.split('.')[1] !== 'pdf') {
          this.setMessage('error', 'File should be a pdf format!');
        } else {
          document.getElementById('upload-button').disabled = true;
          this.that.submitForm();
        }
        break;
      case 'uploadFollowUpCases':
        if (this.that.state.recipients.length === 0) {
          if (this.that.state.recipients === '') {
            const message = 'Ensure the excel file has valid phone numbers!';
            this.setMessage('error', message);
          } else {
            const data = [];
            data.push(this.that.state.recipient);
            this.that.setState({
              recipients: data,
            });
            this.that.submitFormUpload();
          }
        } else {
          this.that.submitFormUpload();
          this.that.setState({
            modal1: false,
            recipients: '',
          });
        }

        break;
      case 'allocateCustomerFollowUp':
        if (roles.includes('Can Allocate Customer Follow Up Cases')) {
          this.that.submitForm();
          this.that.setState({ modal2: false });
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'bulkAllocateFollowUps':
        if (roles.includes('Can Allocate Customer Follow Up Cases')) {
          this.that.submitBulkAllocation();
          this.that.setState({ modal3: false });
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'loanArrearsAllocation':
        if (roles.includes('Can Allocate Arrears Escalation Cases')) {
          this.that.submitForm();
          this.that.setState({ modal1: false });
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'customerPersonalDetails':
        if (
          roles.includes('Can Create Customer')
          || roles.includes('Can Update Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            parseInt(this.that.state.idType, 10) === 0
            && this.that.state.customerIdNumber.length < 7
          ) {
            this.setMessage(
              'error',
              'ID Number should not be less than 7 digits!',
            );
          } else {
            if (this.that.state.customerPhoneNumber.length < 12) {
              this.setMessage('error', 'Mobile Number should be 12 digits!');
            } else {
              this.that.submitForm(special);
            }
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;

      case 'customerDraftDetails':
        if (
          roles.includes('Can Create Customer')
          || roles.includes('Can Update Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            parseInt(this.that.state.idType, 10) === 0
            && this.that.state.customerIdNumber.length < 7
          ) {
            this.setMessage(
              'error',
              'ID Number should not be less than 7 digits!',
            );
          } else {
            if (this.that.state.customerPhoneNumber.length < 12) {
              this.setMessage('error', 'Mobile Number should be 12 digits!');
            } else if (this.that.state.scoredAmount !== ''
            && parseFloat(this.that.state.scoredAmount.toString().replace(/,/g, ''))
            > parseFloat(this.that.state.calculatedScoredAmount.toString().replace(/,/g, ''))
            ) {
              this.setMessage('error', `Scored amount cannot be more than ${this.that.state.calculatedScoredAmount}`);
            } else {
              // if (this.that.state.physicalAddress === 'null, null') {
              //   this.setMessage('error', 'Input a valid physical address!');
              // } else if (this.that.state.businessLocation === 'null, null') {
              //   this.setMessage('error', 'Input a valid business address!');
              // } else {
              this.that.submitForm(special);
              // }
            }
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'completeCustomerDraftDetails':
        if (
          roles.includes('Can Create Customer')
          || roles.includes('Can Update Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            parseInt(this.that.state.idType, 10) === 0
            && this.that.state.customerIdNumber.length < 7
          ) {
            this.setMessage(
              'error',
              'ID Number should not be less than 7 digits!',
            );
          } else {
            if (this.that.state.customerPhoneNumber.length < 12) {
              this.setMessage('error', 'Mobile Number should be 12 digits!');
            } else {
              this.that.submitForm(special);
            }
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'customerDetails':
        if (
          roles.includes('Can Create Customer')
          || roles.includes('Can Update Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (
            parseInt(this.that.state.idType, 10) === 0
            && this.that.state.customerIdNumber.length < 7
          ) {
            this.setMessage(
              'error',
              'ID Number should not be less than 7 digits!',
            );
          } else {
            if (this.that.state.customerPhoneNumber.length < 12) {
              // || this.that.state.employerTelephoneNumber.length < 12
              this.setMessage('error', 'Mobile Number should be 12 digits!');
            } else {
              this.that.setState({
                recordStatus: 6,
              });
              this.that.submitForm(special);
            }
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'updatePtpCase':
        if (roles.includes('Can Update Ptp Case')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'createFollowUpNote':
        if (roles.includes('Can Create Follow Up Note')) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'Personal Details':
        const data = this.that.state.caseNote;
        const index = data.findIndex((note) => note.checklistItem === special);

        data[index].comments = this.that.state.status === 'approved'
          ? 'Ok'
          : this.that.state.comments;
        data[index].status = this.that.state.status;
        data[index].checkedBy = sessionStorage.getItem('userId');
        data[index].userName = sessionStorage.getItem('userName');
        data[index].reasonId = this.that.state.reasonId;
        data[index].remarks = this.that.state.remarks;

        this.that.setState({
          caseNote: data,
          status: '',
          comments: '',
          reason: '',
          reasonId: '',
          remarks: '',
        });
        const next = this.that.state.checklist[index + 1].description
          .split(' ')[0]
          .toLowerCase();

        document.getElementById(`${next}`).classList.remove('disabled');
        document
          .getElementById(
            `left-tabs-example-tab-${this.that.state.checklist[index].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tab-${
              this.that.state.checklist[index + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[index].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[index].description}`,
          )
          .classList.remove('show');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[index + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[index + 1].description
            }`,
          )
          .classList.add('show');
        document
          .getElementById(`${special.split(' ')[0].toLowerCase()}`)
          .classList.remove('disabled');
        if (
          roles.includes('Can Approve Customer Details')
          || roles.includes('Can Verify Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'Location Details':
        const location = this.that.state.caseNote;
        const lIndex = location.findIndex(
          (note) => note.checklistItem === special,
        );

        location[lIndex].comments = this.that.state.status === 'approved'
          ? 'Ok'
          : this.that.state.comments;
        location[lIndex].status = this.that.state.status;
        location[lIndex].checkedBy = sessionStorage.getItem('userId');
        location[lIndex].userName = sessionStorage.getItem('userName');
        location[lIndex].reasonId = this.that.state.reasonId;
        location[lIndex].remarks = this.that.state.remarks;

        this.that.setState({
          caseNote: location,
          status: '',
          comments: '',
          reason: '',
          reasonId: '',
          remarks: '',
        });

        const lnext = this.that.state.checklist[lIndex + 1].description
          .split(' ')[0]
          .toLowerCase();
        document.getElementById(`${lnext}`).classList.remove('disabled');
        document
          .getElementById(
            `left-tabs-example-tab-${this.that.state.checklist[lIndex].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tab-${
              this.that.state.checklist[lIndex + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[lIndex].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[lIndex].description}`,
          )
          .classList.remove('show');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[lIndex + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[lIndex + 1].description
            }`,
          )
          .classList.add('show');
        document
          .getElementById(`${special.split(' ')[0].toLowerCase()}`)
          .classList.remove('disabled');

        if (
          roles.includes('Can Approve Customer Details')
          || roles.includes('Can Verify Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'Professional Details':
        const pData = this.that.state.caseNote;
        const pIndex = pData.findIndex(
          (note) => note.checklistItem === special,
        );

        pData[pIndex].comments = this.that.state.status === 'approved'
          ? 'Ok'
          : this.that.state.comments;
        pData[pIndex].status = this.that.state.status;
        pData[pIndex].checkedBy = sessionStorage.getItem('userId');
        pData[pIndex].userName = sessionStorage.getItem('userName');
        pData[pIndex].reasonId = this.that.state.reasonId;
        pData[pIndex].remarks = this.that.state.remarks;

        this.that.setState({
          caseNote: pData,
          status: '',
          comments: '',
          reason: '',
          reasonId: '',
          remarks: '',
        });

        const pNext = this.that.state.checklist[pIndex + 1].description
          .split(' ')[0]
          .toLowerCase();

        document.getElementById(`${pNext}`).classList.remove('disabled');
        document
          .getElementById(
            `left-tabs-example-tab-${this.that.state.checklist[pIndex].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tab-${
              this.that.state.checklist[pIndex + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[pIndex].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[pIndex].description}`,
          )
          .classList.remove('show');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[pIndex + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[pIndex + 1].description
            }`,
          )
          .classList.add('show');
        document
          .getElementById(`${special.split(' ')[0].toLowerCase()}`)
          .classList.add('disabled');
        if (
          roles.includes('Can Approve Customer Details')
          || roles.includes('Can Verify Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'Alternate Contact Details':
        const aData = this.that.state.caseNote;
        const aIndex = aData.findIndex(
          (note) => note.checklistItem === special,
        );

        aData[aIndex].comments = this.that.state.status === 'approved'
          ? 'Ok'
          : this.that.state.comments;
        aData[aIndex].status = this.that.state.status;
        aData[aIndex].checkedBy = sessionStorage.getItem('userId');
        aData[aIndex].userName = sessionStorage.getItem('userName');
        aData[aIndex].reasonId = this.that.state.reasonId;
        aData[aIndex].remarks = this.that.state.remarks;

        this.that.setState({
          caseNote: aData,
          status: '',
          comments: '',
          reason: '',
          reasonId: '',
          remarks: '',
        });

        const aNext = this.that.state.checklist[aIndex + 1].description
          .split(' ')[0]
          .toLowerCase();

        document.getElementById(`${aNext}`).classList.remove('disabled');
        document
          .getElementById(
            `left-tabs-example-tab-${this.that.state.checklist[aIndex].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tab-${
              this.that.state.checklist[aIndex + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[aIndex].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[aIndex].description}`,
          )
          .classList.remove('show');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[aIndex + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[aIndex + 1].description
            }`,
          )
          .classList.add('show');
        document
          .getElementById(`${special.split(' ')[0].toLowerCase()}`)
          .classList.add('disabled');
        if (
          roles.includes('Can Approve Customer Details')
          || roles.includes('Can Verify Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;

      case 'Guarantor Details':
        const gData = this.that.state.caseNote;
        const gIndex = gData.findIndex(
          (note) => note.checklistItem === special,
        );

        gData[gIndex].comments = this.that.state.status === 'approved'
          ? 'Ok'
          : this.that.state.comments;
        gData[gIndex].status = this.that.state.status;
        gData[gIndex].checkedBy = sessionStorage.getItem('userId');
        gData[gIndex].userName = sessionStorage.getItem('userName');
        gData[gIndex].reasonId = this.that.state.reasonId;
        gData[gIndex].remarks = this.that.state.remarks;

        this.that.setState({
          caseNote: gData,
          status: '',
          comments: '',
          reason: '',
          reasonId: '',
          remarks: '',
        });

        const gNext = this.that.state.checklist[gIndex + 1].description
          .split(' ')[0]
          .toLowerCase();

        document.getElementById(`${gNext}`).classList.remove('disabled');
        document
          .getElementById(
            `left-tabs-example-tab-${this.that.state.checklist[gIndex].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tab-${
              this.that.state.checklist[gIndex + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[gIndex].description}`,
          )
          .classList.remove('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${this.that.state.checklist[gIndex].description}`,
          )
          .classList.remove('show');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[gIndex + 1].description
            }`,
          )
          .classList.add('active');
        document
          .getElementById(
            `left-tabs-example-tabpane-${
              this.that.state.checklist[gIndex + 1].description
            }`,
          )
          .classList.add('show');
        document
          .getElementById(`${special.split(' ')[0].toLowerCase()}`)
          .classList.add('disabled');
        if (
          roles.includes('Can Approve Customer Details')
          || roles.includes('Can Verify Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          this.that.submitForm();
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'Cashflow Analysis':
        if (window.location.href.split('/')[4] === 'old-customer-approval') {
          if (
            parseInt(this.that.state.newScoredAmount, 10)
            > parseInt(this.that.state.maximumLoanableAmount.split(' ')[1].replace(/,/g, ''), 10)
          ) {
            this.setMessage(
              'error',
              `Scored Amount cannot be greater than the maximum starting limit allowed of ${this.that.state.maximumLoanableAmount.split(' ')[1].replace(/,/g, '')}`,
            );
          } else {
            const cData = this.that.state.caseNote;
            const cIndex = cData.findIndex(
              (note) => note.checklistItem === special,
            );

            cData[cIndex].comments = this.that.state.status === 'approved'
              ? 'Ok'
              : this.that.state.comments;
            cData[cIndex].status = this.that.state.status;
            cData[cIndex].checkedBy = sessionStorage.getItem('userId');
            cData[cIndex].userName = sessionStorage.getItem('userName');
            cData[cIndex].reasonId = this.that.state.reasonId;
            cData[cIndex].remarks = this.that.state.remarks;

            this.that.setState({
              caseNote: cData,
              status: '',
              comments: '',
              reason: '',
              reasonId: '',
              remarks: '',
            });

            const cNext = this.that.state.checklist[cIndex + 1].description
              .split(' ')[0]
              .toLowerCase();

            document.getElementById(`${cNext}`).classList.remove('disabled');
            document
              .getElementById(
                `left-tabs-example-tab-${this.that.state.checklist[cIndex].description}`,
              )
              .classList.remove('active');
            document
              .getElementById(
                `left-tabs-example-tab-${
                  this.that.state.checklist[cIndex + 1].description
                }`,
              )
              .classList.add('active');
            document
              .getElementById(
                `left-tabs-example-tabpane-${this.that.state.checklist[cIndex].description}`,
              )
              .classList.remove('active');
            document
              .getElementById(
                `left-tabs-example-tabpane-${this.that.state.checklist[cIndex].description}`,
              )
              .classList.remove('show');
            document
              .getElementById(
                `left-tabs-example-tabpane-${
                  this.that.state.checklist[cIndex + 1].description
                }`,
              )
              .classList.add('active');
            document
              .getElementById(
                `left-tabs-example-tabpane-${
                  this.that.state.checklist[cIndex + 1].description
                }`,
              )
              .classList.add('show');
            document
              .getElementById(`${special.split(' ')[0].toLowerCase()}`)
              .classList.add('disabled');

            if (
              roles.includes('Can Approve Customer Details')
              || roles.includes('Can Verify Customer Details')
              || parseInt(sessionStorage.getItem('userType'), 10) === 1
            ) {
              this.that.submitForm();
            } else {
              this.that.props.history.push('/app/403');
            }
          }
        } else {
          if (
            parseInt(this.that.state.newScoredAmount, 10)
            > parseInt(this.that.state.appraisalDetails.maximumStartingLimit, 10)
          ) {
            this.setMessage(
              'error',
              `Scored Amount cannot be greater than the maximum starting limit allowed of ${this.that.state.appraisalDetails.maximumStartingLimit}`,
            );
          } else {
            const cData = this.that.state.caseNote;
            const cIndex = cData.findIndex(
              (note) => note.checklistItem === special,
            );

            cData[cIndex].comments = this.that.state.status === 'approved'
              ? 'Ok'
              : this.that.state.comments;
            cData[cIndex].status = this.that.state.status;
            cData[cIndex].checkedBy = sessionStorage.getItem('userId');
            cData[cIndex].userName = sessionStorage.getItem('userName');
            cData[cIndex].reasonId = this.that.state.reasonId;
            cData[cIndex].remarks = this.that.state.remarks;

            this.that.setState({
              caseNote: cData,
              status: '',
              comments: '',
              reason: '',
              reasonId: '',
              remarks: '',
            });

            const cNext = this.that.state.checklist[cIndex + 1].description
              .split(' ')[0]
              .toLowerCase();

            document.getElementById(`${cNext}`).classList.remove('disabled');
            document
              .getElementById(
                `left-tabs-example-tab-${this.that.state.checklist[cIndex].description}`,
              )
              .classList.remove('active');
            document
              .getElementById(
                `left-tabs-example-tab-${
                  this.that.state.checklist[cIndex + 1].description
                }`,
              )
              .classList.add('active');
            document
              .getElementById(
                `left-tabs-example-tabpane-${this.that.state.checklist[cIndex].description}`,
              )
              .classList.remove('active');
            document
              .getElementById(
                `left-tabs-example-tabpane-${this.that.state.checklist[cIndex].description}`,
              )
              .classList.remove('show');
            document
              .getElementById(
                `left-tabs-example-tabpane-${
                  this.that.state.checklist[cIndex + 1].description
                }`,
              )
              .classList.add('active');
            document
              .getElementById(
                `left-tabs-example-tabpane-${
                  this.that.state.checklist[cIndex + 1].description
                }`,
              )
              .classList.add('show');
            document
              .getElementById(`${special.split(' ')[0].toLowerCase()}`)
              .classList.add('disabled');

            if (
              roles.includes('Can Approve Customer Details')
              || roles.includes('Can Verify Customer Details')
              || parseInt(sessionStorage.getItem('userType'), 10) === 1
            ) {
              this.that.submitForm();
            } else {
              this.that.props.history.push('/app/403');
            }
          }
        }
        break;
      case 'Detailed Summary':
        const dData = this.that.state.caseNote;
        const dIndex = dData.findIndex(
          (note) => note.checklistItem === special,
        );

        dData[dIndex].comments = this.that.state.status === 'approved'
          ? 'Ok'
          : this.that.state.comments;
        dData[dIndex].status = this.that.state.status;
        dData[dIndex].checkedBy = sessionStorage.getItem('userId');
        dData[dIndex].userName = sessionStorage.getItem('userName');
        dData[dIndex].reasonId = this.that.state.reasonId;
        dData[dIndex].remarks = this.that.state.remarks;

        this.that.setState({
          caseNote: dData,
        });

        sessionStorage.setItem('special', special);

        const appData = {
          notes: JSON.stringify(this.that.state.caseNote),
          createdBy: sessionStorage.getItem('userId'),
          scoredAmount: this.that.state.newScoredAmount,
          // maxAllowedLimit: this.that.state.appraisalDetails.maximumStartingLimit,
          newLoanCategoryId: this.that.state.newLoanCategoryId,
          status:
            this.that.state.caseNote.filter(
              (note) => note.status === 'rejected',
            ).length !== 0
              ? 'rejected'
              : this.that.state.status,
        };

        const spc = window.location.href.split('/')[4] === 'customer-approval'
        || window.location.href.split('/')[4] === 'old-customer-approval'
          ? 'customerApprovals'
          : 'customerCallbacks';
        if (
          roles.includes('Can Approve Customer Details')
          || roles.includes('Can Verify Customer Details')
          || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          const scored = {
            scoredAmount: this.that.state.newScoredAmount,
            loanCategoryId: this.that.state.newLoanCategoryId,
          };

          this.that.services.submitAction(scored, 'updateCustomerDetails', 'put');
          this.that.services.submitAction(appData, spc, 'put');
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'linkEmployer':
        this.that.submitForm();
        break;
      case 'loanWriteOff':
        this.that.submitForm();
        break;
      case 'approveLoanWriteOff':
        if (this.that.state.createdBy === sessionStorage.getItem('userId')) {
          this.that.submitForm();
        } else {
          this.setMessage('error', 'The write-off cannot be approved by the initiator.');
        }
        break;
      case 'loanReversal':
        this.that.submitForm();
        break;
      case 'updateLoanReversal':
        if (this.that.state.createdBy === sessionStorage.getItem('userId')) {
          this.that.submitForm();
        } else {
          this.setMessage('error', 'The reversal cannot be approved by the initiator.');
        }
        break;
      case 'saveAlternativeContact':
        this.that.submitAlternativeContacts();
        this.that.setState({
          modal1: false,
        });
        break;
      case 'shuffleAgents':
        if (this.that.state.agentList.length === 0 && this.that.state.currentAllocatedUserId !== '' && this.that.state.newAllocatedUserId !== '') {
          const newData = this.that.state.agentList;
          let d = {};
          d = {
            currentAllocatedUserId: this.that.state.currentAllocatedUserId,
            newAllocatedUserId: this.that.state.newAllocatedUserId,
          };
          newData.push(d);
          this.that.setState({
            agentList: newData,
            currentAllocatedUserId: '',
            newAllocatedUserId: '',
          });
          this.that.shuffleAgents();
          this.that.setState({
            modal4: false,
          });
        } else if (this.that.state.agentList.length === 0 && (this.that.state.currentAllocatedUserId === '' || this.that.state.newAllocatedUserId === '')) {
          this.setMessage('error', 'Kindly select agents to be shuffled!');
        } else {
          this.that.shuffleAgents();
          this.that.setState({
            modal4: false,
          });
        }
        break;
      case 'updateInstallments':
        if (this.that.state.negotiatedInstallments < this.that.state.minimumInstallments || this.that.state.negotiatedInstallments > this.that.state.maximumInstallments) {
          this.setMessage(
            'error',
            'Installments must be between the minumum and maximum range',
          );
        } else {
          this.that.submitForm();
        }
        break;
      case 'employerInformation':
        this.nextStep();
        this.restValues();
        break;
      case 'employerProfession':
        this.nextStep();
        this.restValues();
        break;
      case 'employerContactDetails':
        this.nextStep();
        this.restValues();
        break;
      case 'completeEmployerProfile':
        this.that.submitForm();
        break;
      case 'updateEmployerProfile':
        this.that.submitForm();
        break;
      case 'approveEmployer':
        this.that.submitForm();
        break;
      case 'saveReportCategory':
        if (
          roles.includes('Can Create Report Category')
            || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (this.that.state.userTypes.length === 0) {
            this.setMessage('error', 'Report Users cannot be empty!');
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'updateReportCategory':
        if (
          roles.includes('Can Update Report Category')
              || parseInt(sessionStorage.getItem('userType'), 10) === 1
        ) {
          if (this.that.state.userTypes.length === 0) {
            this.setMessage('error', 'Report Users cannot be empty!');
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;
      case 'allocateReports':
        if (roles.includes('Can Allocate Reports') || parseInt(sessionStorage.getItem('userType'), 10) === 1) {
          if (this.that.state.reportIds.length === 0 || this.that.state.roleIds.length === 0) {
            this.setMessage('error', 'Ensure you have selected at least one role and one report!');
          } else {
            this.that.submitForm();
          }
        } else {
          this.that.props.history.push('/app/403');
        }
        break;

      default:
        break;
    }
  };

  closeAlert = () => {
    this.that.setState({
      error: false,
      errorMessage: '',
      success: false,
      successMessage: '',
      warning: false,
      warningMessage: '',
    });
  };

  clearForm = () => {
    let index;
    const selects = document.getElementsByTagName('select');
    // eslint-disable-next-line prefer-const
    const inputs = document.getElementsByTagName('input');
    for (index = 0; index < inputs.length; ++index) {
      const input = inputs[index];
      const name = inputs[index].name;
      this.that.setState({ [name]: '' });
      input.value = '';
    }
    for (index = 0; index < selects.length; ++index) {
      const select = selects[index];
      const name = selects[index].name;
      this.that.setState({ [name]: '' });
      select.value = '';
    }
  };

  getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.that.setState({
          businessCoordinates: `${position.coords.latitude},${position.coords.longitude}`,
          residenceCoordinates: `${position.coords.latitude},${position.coords.longitude}`,
        });

        const geocoder = new window.google.maps.Geocoder();

        const myLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // eslint-disable-next-line no-useless-escape
        const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        geocoder.geocode({ latLng: myLocation }, (results, status) => {
          let location;
          let area;

          if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              const addr = results[0].address_components;
              for (let i = 0; i < addr.length; i++) {
                if (addr[i].types[0] === 'locality') {
                  location = addr[i].long_name;
                }
                if (addr[i].types[0] === 'administrative_area_level_1') {
                  area = addr[i].long_name;
                }
                this.that.setState({
                  physicalAddress: format.test(results[0].formatted_address)
                    ? `${location}, ${area}`
                    : results[0].formatted_address,
                  businessLocation: format.test(results[0].formatted_address)
                    ? `${location}, ${area}`
                    : results[0].formatted_address,
                });
              }
            }
          }
        });
      });
    }
  };

  clearInputs = () => {
    let index;
    // eslint-disable-next-line prefer-const
    const inputs = document.getElementsByTagName('input');
    for (index = 0; index < inputs.length; ++index) {
      const input = inputs[index];
      const name = inputs[index].name;
      this.that.setState({ [name]: '' });
      input.value = '';
    }
  };

  isNumber = (value) => {
    if ((undefined === value) || (value === null)) {
      return false;
    }
    if (typeof value === 'number') {
      return true;
    }
    return !Number.isNaN(value - 0);
  };

  feeSplitTotal = (feeSplits, newSplit) => {
    let result = 0;
    feeSplits.forEach((element) => {
      result += parseFloat(element.percentage);
    });
    return result + parseFloat(newSplit);
  };

  confirmPopup(e, data, action, area) {
    e.preventDefault();
    this.that.setState({
      alert: (
        <SweetAlert
          btnSize="xs"
          warning
          confirmBtnText="Proceed!"
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          title="Confirm this action!"
          onConfirm={() => this.proceedSubmission(data.id, action, area)}
          onCancel={this.hideAlert}
        >
          Are you sure?
        </SweetAlert>
      ),
    });
  }

  handleBankSearchChange = (bank) => {
    this.that.setState({
      bank,
      bankBranchCode: '',
    });
  };

  handleChartOfAccountSearchChange = (chartOfAccount) => {
    this.that.setState({
      chartOfAccount,
    });
  };

  handleGLAccountSearchChange = (GLAccount) => {
    this.that.setState({
      GLAccount,
    });
  };

  handleInterestGLAccountSearchChange = (interestGLAccount) => {
    this.that.setState({
      interestGLAccount,
    });
  };

  handleBankBranchSearchChange = (bankBranchCode) => {
    this.that.setState({ bankBranchCode });
  };

  handleCountyChange = (county) => {
    this.that.setState({
      county,
    });
  };

  setCurrentPage = (currentPage) => {
    this.that.setState({ currentPage });
  };

  showCustomerModal = () => {
    this.that.setState({
      customerModal: true,
    });
  };

  handleModalClose = () => {
    this.that.setState({
      customerModal: false,
    });
  };

  handleCustomerSelection = (e, data) => {
    e.preventDefault();
    this.that.setState({
      customerName: data.customerName,
      idNumber: data.idNumber,
      customerId: data.id,
      branchId: data.branchId,
      beneficiaryAccountNumber: parseInt(this.that.state.disbursementMethod, 10) === 0 ? data.mobileNumber : '',
      relationshipManagerId: '',
      customerModal: false,
    });
  };

  generateSettlements(arrayAccount, arrayMobile, filename) {
    let message;
    const requiredFields = [];
    const array1 = arrayAccount;
    const array2 = arrayMobile;

    const resultAccount = [];
    const resultMobile = [];
    array1.forEach((doc) => {
      resultAccount.push(doc.amountPayable);
    });
    array2.forEach((doc) => {
      resultMobile.push(doc.amountPayable);
    });

    const sumAccount = resultAccount
      .reduce((a, b) => a + b, 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const sumMobile = resultMobile
      .reduce((a, b) => a + b, 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (arrayAccount.length > 0 && arrayMobile.length === 0) {
      message = `Are you sure you want to generate: ${arrayAccount.length} bank payment(s) totaling Kshs. ${sumAccount} ?`;
    } else if (arrayMobile.length > 0 && arrayAccount === 0) {
      message = `Are you sure you want to generate: ${arrayMobile.length} mobile payment(s) totaling Kshs. ${sumMobile} ?`;
    } else if (arrayAccount.length > 0 && arrayMobile.length > 0) {
      message = `Are you sure you want to generate: ${arrayMobile.length} mobile payment(s) totaling Kshs. ${sumMobile} and ${arrayAccount.length} bank payment(s) totaling Kshs. ${sumAccount}`;
    } else if (arrayAccount.length === 0 && arrayMobile.length === 0) {
      message = `There are ${arrayAccount.length} unpaid settlements`;
    }
    this.that.setState({
      alert: (
        <SweetAlert
          btnSize="xs"
          warning
          confirmBtnText="Proceed!"
          showCancel
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          title="Generate payment Files?"
          onConfirm={(e) => {
            this.that.downloadCSV({
              fileName: `BankPayments${moment(new Date()).format(
                'DDMMYYYY',
              )}.csv`,
            });
            this.handleSubmit(e, requiredFields, 'generateSettlement');
          }}
          onCancel={this.hideAlert}
        >
          {message}
        </SweetAlert>
      ),
    });
  }

  confirmImport(special, data) {
    let str;
    let message;
    switch (special) {
      case 'branches':
        const names = [];
        data.forEach((branch) => {
          names.push(branch.Name);
        });
        str = names.join(', ');
        if (data.length > 1) {
          message = `The branches; ${str} already exist. Do you want to overwrite the details?`;
        } else {
          message = 'This branch already exists. Do you want to overwrite the details?';
        }
        break;
      case 'users':
        const userNames = [];
        data.forEach((user) => {
          userNames.push(user.FirstName);
        });
        str = userNames.join(', ');
        if (data.length > 1) {
          message = `The users; ${str} already exist!`;
        } else {
          message = 'This user already exist!';
        }
        break;
      case 'roArrearsAllocation':
        const customerNames = [];
        data.forEach((customer) => {
          customerNames.push(customer.CustomerName);
        });
        str = customerNames.join(', ');
        if (data.length > 1) {
          message = `The customers: ${str} already exist. Do you want to overwrite the details?`;
        } else {
          message = 'This customer already exists. Do you want to overwrite the details?';
        }
        break;
      default:
        break;
    }
    this.that.setState({
      alert: (
        <SweetAlert
          btnSize="xs"
          warning
          confirmBtnText="Proceed!"
          showCancel
          showConfirm={special !== 'users'}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          title="Confirm this action!"
          onConfirm={() => (special === 'users' ? this.hideAlert() : this.that.submitForm())}
          onCancel={this.hideAlert}
        >
          {message}
        </SweetAlert>
      ),
    });
  }

  hideAlert = () => {
    this.that.setState({
      alert: null,
      showFilter: false,
    });
  };

  proceedSubmission = (value, action, area) => {
    this.hideAlert();
    this.that.setState({ isLoading: true });
    this.that.services.submitAction(value, area, action, 'put');
  };

  addMonths = (event, special) => {
    const target = event.target;
    const name = target.name;
    this.that.setState({
      [name]: target.value,
    });

    switch (special) {
      case 'term':
        if (this.that.state.startDate === '') {
          document.getElementById('startDate').classList.add('required');
        } else {
          this.that.setState({
            maturityDate: new Date(this.that.state.startDate).setMonth(
              new Date(this.that.state.startDate).getMonth()
                + parseInt(event.target.value, 10),
            ),
          });
        }
        break;
      case 'settlementFrequency':
        if (this.that.state.startDate === '') {
          document.getElementById('startDate').classList.add('required');
        } else {
          let endDate = '';
          switch (event.target.value) {
            case '1':
              endDate = new Date(this.that.state.startDate).setMonth(
                new Date(this.that.state.startDate).getMonth() + 1,
              );
              break;
            case '2':
              endDate = new Date(this.that.state.startDate).setMonth(
                new Date(this.that.state.startDate).getMonth() + 3,
              );
              break;
            case '3':
              endDate = new Date(this.that.state.startDate).setMonth(
                new Date(this.that.state.startDate).getMonth() + 6,
              );
              break;
            case '4':
              endDate = new Date(this.that.state.startDate).setMonth(
                new Date(this.that.state.startDate).getMonth() + 12,
              );
              break;
            default:
              break;
          }
          this.that.setState({
            nextSettlement: endDate,
          });
        }
        break;
      default:
        break;
    }
  };

  handleSelect = (special, data) => (event) => {
    switch (special) {
      case 'markets':
        document.getElementById('marketId').value = event.target.textContent;
        this.that.setState({
          marketId: data.id,
          searchResults: [],
          countyId: data.countyId,
          constituencyId: data.constituencyId,
          wardId: data.wardId,
        });
        break;
      case 'chartOfAccounts':
        document.getElementById('parentAccount').value = event.target.textContent;
        this.that.setState({
          parentId: data.id,
          searchResults: [],
        });
        break;

      case 'reports':
        document.getElementById('parentId').value = event.target.textContent;
        this.that.setState({
          parentId: data.id,
          searchResults: [],
        });
        break;

      case 'customerAccounts':
        document.getElementById('customerId').value = event.target.textContent;
        this.that.setState({
          customerId: data.id,
          customerCode: data.customerCode,
          customers: [],
        });
        break;

      case 'journalEntries':
        document.getElementById('accountName').value = event.target.textContent;
        this.that.setState({
          accountId: data.id,
          searchResults: [],
          customerAccounts: [],
        });
        break;
      case 'journalDetails':
        document.getElementById('detailAccountName').value = event.target.textContent;
        this.that.setState({
          detailAccountId: data.id,
          detailResults: [],
          detailCustomerAccounts: [],
        });
        break;

      default:
        break;
    }
  };

  handleSearch = (data, special) => {
    switch (special) {
      case 'markets':
        if (data.target.value.length > 1) {
          this.that.setState({
            searchResults: this.that.state.markets.filter((market) => market.name.toLowerCase().includes(data.target.value.toLowerCase())),
          });
        } else {
          this.that.setState({
            searchResults: this.that.state.markets,
          });
        }
        break;
      case 'outbox':
        if (data.length > 3) {
          this.that.services.getSearchResults(data, special);
        } else {
          this.that.services.getCompanyOutbox(10, 0);
        }

        break;
      case 'journalEntries':
        if (parseInt(this.that.state.journalType, 10) === 3 || parseInt(this.that.state.journalType, 10) === 4) {
          if (data.target.value.length > 1) {
            this.that.services.searchCustomerAccounts(
              data.target.value,
            );
          } else {
            this.that.setState({
              customerAccounts: [],
            });
          }
        } else {
          if (data.target.value.length > 1) {
            this.that.setState({
              searchResults: this.that.state.chartOfAccounts.filter((account) => account.accountName.toLowerCase().includes(data.target.value.toLowerCase())),
            });
          } else {
            this.that.setState({
              searchResults: this.that.state.chartOfAccounts,
            });
          }
        }

        break;

      case 'journalDetails':
        if (parseInt(this.that.state.accountType, 10) === 2) {
          if (data.target.value.length > 1) {
            this.that.services.searchCustomerAccounts(
              data.target.value,
            );
            this.that.setState({
              detailCustomerAccounts: this.that.state.customerAccounts,
              display: false,
            });
          } else {
            this.that.setState({
              detailCustomerAccounts: [],
            });
          }
        } else {
          if (data.target.value.length > 1) {
            this.that.setState({
              detailResults: this.that.state.chartOfAccounts.filter((account) => account.accountName.toLowerCase().includes(data.target.value.toLowerCase())),
            });
          } else {
            this.that.setState({
              detailResults: this.that.state.chartOfAccounts,
            });
          }
        }
        if (data.target.value.length > 1) {
          this.that.setState({
            detailResults: this.that.state.chartOfAccounts.filter((account) => account.accountName.toLowerCase().includes(data.target.value.toLowerCase())),
          });
        } else {
          this.that.setState({
            detailResults: this.that.state.chartOfAccounts,
          });
        }

        break;
      case 'customerAccounts':
        if (data.target.value.length > 1) {
          this.that.setState(
            {
              searchTerm: data.target.value,
            },
            this.that.services.getCompanyCustomers(
              10,
              0,
              data.target.value,
            ),
          );
        } else {
          this.that.setState({
            customers: this.that.state.customers,
          });
        }

        break;

      case 'chartOfAccounts':
        if (data.target.value.length > 1) {
          this.that.setState({
            searchResults: this.that.state.chartOfAccounts.filter((account) => account.isEnabled && account.accountName.toLowerCase().includes(data.target.value.toLowerCase())),
          });
        } else {
          this.that.setState({
            searchResults: this.that.state.chartOfAccounts,
          });
        }

        break;
      case 'customers':
        if (data.length > 3) {
          this.that.setState(
            {
              searchTerm: data,
            },
            this.that.services.getCompanyCustomers(
              this.that.state.pageLimit,
              this.that.state.offset,
              data,
            ),
          );
        }

        if (data.length < 3) {
          this.that.setState(
            {
              searchTerm: data,
            },
            this.that.services.getCompanyCustomers(
              this.that.state.pageLimit,
              this.that.state.offset,
              data,
            ),
          );
        }

        break;
      case 'marketingLeads':
        if (data.length > 3) {
          this.that.setState(
            {
              searchTerm: data,
            },
            this.that.services.getCompanyLeads(
              this.that.state.pageLimit,
              this.that.state.offset,
              data,
            ),
          );
        }

        if (data.length < 3) {
          this.that.setState(
            {
              searchTerm: data,
            },
            this.that.services.getCompanyLeads(
              this.that.state.pageLimit,
              this.that.state.offset,
              data,
            ),
          );
        }

        break;
      case 'loanCustomerSearch':
        if (data.length > 3) {
          this.that.setState(
            {
              searchTerm: data,
            },
            this.that.services.getApprovedCustomers(
              this.that.state.pageLimit,
              this.that.state.offset,
              data,
            ),
          );
        }

        if (data.length < 3) {
          this.that.setState(
            {
              searchTerm: data,
            },
            this.that.services.getApprovedCustomers(
              this.that.state.pageLimit,
              this.that.state.offset,
              data,
            ),
          );
        }

        break;
      case 'customer-followup-cases':
        const criteria = JSON.parse(sessionStorage.getItem('filtersToApply')) === undefined
          || JSON.parse(sessionStorage.getItem('filtersToApply')) === null
          ? []
          : JSON.parse(sessionStorage.getItem('filtersToApply'));
        if (data.length > 3) {
          this.that.setState(
            {
              searchTermFollowUps: data,
            },
            this.that.services.getFollowUpCases(
              this.that.state.pageLimit,
              this.that.state.currentPage,
              data,
              criteria,
            ),
          );
        } else {
          this.that.services.getFollowUpCases(
            this.that.state.pageLimit,
            this.that.state.currentPage,
            '',
            criteria,
          );
        }
        break;
      case 'customer-followup-allocation':
        if (data.length > 3) {
          this.that.setState(
            {
              searchTerm: data,
            },
            this.that.services.getCustomerFollowUps(
              this.that.state.pageLimit,
              this.that.state.offset,
              this.that.state.allocationStatusFilter,
              data,
            ),
          );
        } else {
          this.that.services.getCustomerFollowUps(
            this.that.state.pageLimit,
            this.that.state.offset,
            this.that.state.allocationStatusFilter,
            '',
          );
        }
        break;
      case 'ro-followup-allocation':
        if (data.length > 3) {
          this.that.setState(
            {
              searchTerm: data,
            },
            this.that.services.getEscalatedFollowUps(
              this.that.state.pageLimit,
              this.that.state.offset,
              data,
            ),
          );
        } else {
          this.that.services.getEscalatedFollowUps(
            this.that.state.pageLimit,
            this.that.state.offset,
            '',
          );
        }
        break;
      case 'ro-followups':
        if (data.length > 3) {
          this.that.setState(
            {
              searchTerm: data,
            },
            this.that.services.getEscalatedFollowUps(
              this.that.state.pageLimit,
              this.that.state.offset,
              data,
            ),
          );
        } else {
          this.that.services.getEscalatedFollowUps(
            this.that.state.pageLimit,
            this.that.state.offset,
            '',
          );
        }
        break;
      case 'reports':
        if (data.target.value.length > 1) {
          this.that.setState({
            searchResults: this.that.state.reports.filter((report) => report.name.toLowerCase().includes(data.target.value.toLowerCase())),
          });
        } else {
          this.that.setState({
            searchResults: this.that.state.reports,
          });
        }
        break;
      default:
        break;
    }
  };

  handleSelection = (rowData, special) => {
    let result;
    switch (special) {
      case 'users':
        this.that.setState({
          // eslint-disable-next-line react/no-unused-state
          selectedItems: rowData,
        });
        break;
      case 'branches':
        this.that.setState({
          // eslint-disable-next-line react/no-unused-state
          selectedItems: rowData,
        });
        break;
      case 'settlements':
        this.that.setState({
          // eslint-disable-next-line react/no-unused-state
          selectedItems: rowData,
        });
        break;
      case 'messages':
        this.that.setState({
          // eslint-disable-next-line react/no-unused-state
          selectedItems: rowData,
        });
        break;
      case 'customerFollowups':
        this.that.setState({
          // eslint-disable-next-line react/no-unused-state
          selectedItems: rowData,
        });
        break;
      case 'employees':
        this.that.setState({
          // eslint-disable-next-line react/no-unused-state
          selectedItems: rowData,
        });
        break;
      default:
        break;
    }
  };

  handleAdd = (event, special) => {
    let data = {};
    switch (special) {
      case 'feeGraduatedScaleAdd':
        const scaleData = this.that.state.feeGraduatedScales;
        data = {
          lowerLimit: this.that.state.lowerLimit,
          upperLimit: this.that.state.upperLimit,
          chargeType: this.that.state.chargeType,
          value: this.that.state.value,
        };

        scaleData.push(data);

        this.that.setState({
          feeGraduatedScales: scaleData,
          lowerLimit: '',
          upperLimit: '',
          chargeType: '',
          value: '',
        });
        break;

      case 'productGraduatedScaleAdd':
        const productScale = this.that.state.graduatedScales;
        data = {
          minimumAmount: this.that.state.minimumAmount,
          maximumAmount: this.that.state.maximumAmount,
          interestRateChargeType: this.that.state.interestRateChargeType,
          interestRateValue: this.that.state.interestRateValue,
          accrueFrequency: this.that.state.accrueFrequency,
        };

        productScale.push(data);

        this.that.setState({
          graduatedScales: productScale,
          minimumAmount: '',
          maximumAmount: '',
          interestRateChargeType: '',
          interestRateValue: '',
          accrueFrequency: '',
        });
        break;

      case 'feeSplitAdd':
        const splitData = this.that.state.feeSplits;
        data = {
          chartOfAccount: this.that.state.chartOfAccount,
          feeSplitName: this.that.state.feeSplitName,
          percentage: this.that.state.percentage,
        };

        splitData.push(data);

        this.that.setState({
          feeSplits: splitData,
          chartOfAccount: '',
          feeSplitName: '',
          percentage: '',
        });
        break;

      case 'recipientAdd':
        const newData = this.that.state.recipients;
        if (
          this.that.state.recipient === ''
          || this.that.state.recipient === undefined
        ) {
          this.setMessage('error', 'Input a phone number!');
        } else {
          if (this.that.state.recipient.length < 12) {
            this.setMessage('error', 'Mobile Number should be 12 digits!');
          } else {
            if (!newData.includes(this.that.state.recipient)) {
              newData.push(this.that.state.recipient);
              this.that.setState({
                recipients: newData,
                recipient: '',
              });
            } else {
              this.setMessage('error', 'The recipient already exists!');
            }
          }
        }

        break;

      case 'addNextOfKin':
        const kinData = this.that.state.nextOfKins;

        if (this.that.state.nMobileNumber === this.that.state.mobileNumber) {
          this.setMessage(
            'error',
            'Customer can not be their own Next of Kin!',
          );
        } else {
          const newArr = {
            firstName: this.that.state.nFirstName.toLocaleUpperCase(),
            lastName: this.that.state.nLastName.toLocaleUpperCase(),
            relationship: this.that.state.relationship,
            mobileNumber: this.that.state.nMobileNumber,
          };

          if (
            kinData.filter(
              (kin) => kin.mobileNumber === this.that.state.nMobileNumber,
            ).length > 0
          ) {
            this.setMessage('error', 'Next of Kin with same details exists!');
          } else {
            kinData.push(newArr);

            this.that.setState({
              nextOfKins: kinData,
              nFirstName: '',
              nLastName: '',
              relationship: '',
              nMobileNumber: '+254',
            });
          }
        }

        break;

      case 'addGuarantor':
        const gData = this.that.state.guarantors;
        const kins = this.that.state.nextOfKins;
        const exists = [];
        kins.forEach((kin) => {
          if (kin.mobileNumber === this.that.state.gMobileNumber) {
            exists.push(kin);
          }
        });

        if (exists.length > 0) {
          this.setMessage('error', 'Next of Kin can not be a guarantor!');
        } else if (
          this.that.state.mobileNumber === this.that.state.gMobileNumber
          || this.that.state.idNumber === this.that.state.gIdNumber
        ) {
          this.setMessage('error', 'A customer can not self-guarantee!');
        } else if (
          this.that.state.spouseMobileNumber === this.that.state.gMobileNumber
        ) {
          this.setMessage(
            'error',
            'Customer can not be guaranteed by a spouse!',
          );
        } else {
          const newGArr = {
            firstName: this.that.state.gFirstName.toLocaleUpperCase(),
            lastName: this.that.state.gLastName.toLocaleUpperCase(),
            idType: this.that.state.gIdType,
            mobileNumber: this.that.state.gMobileNumber,
            idNumber: this.that.state.gIdNumber,
          };

          if (
            gData.filter(
              (guarantor) => guarantor.mobileNumber === this.that.state.gMobileNumber
                || guarantor.idNumber === this.that.state.gIdNumber,
            ).length > 0
          ) {
            this.setMessage('error', 'Guarantor with same details exists!');
          } else {
            gData.push(newGArr);
            this.that.setState({
              guarantors: gData,
              gFirstName: '',
              gLastName: '',
              gIdType: '0',
              gIdNumber: '',
              gMobileNumber: '+254',
            });
          }
        }
        break;

      case 'smsDetails':
        const smsDetails = this.that.state.smsDetails;
        const smsObj = {
          smsSenderId: this.that.state.smsSenderId,
          smsProvider: this.that.state.smsProvider,
          messageType: this.that.state.messageType,
        };
        smsDetails.push(smsObj);
        this.that.setState({
          smsDetails,
          smsProvider: '',
          smsSenderId: '',
          messageType: '',
        });

        break;

      case 'recipientDetails':
        const details = this.that.state.recipientDetails;
        if (
          (this.that.state.phoneNumber === ''
            || this.that.state.phoneNumber === undefined)
          && this.that.state.emailAddress === ''
        ) {
          this.setMessage('error', 'Input a phone number or an email address!');
        } else {
          const obj = {
            phoneNumber: this.that.state.phoneNumber,
            emailAddress: this.that.state.emailAddress,
          };
          details.push(obj);
          this.that.setState({
            recipientDetails: details,
            phoneNumber: '',
            emailAddress: '',
          });
        }

        break;

      case 'editChargeScale':
        const scalesData = this.that.state.chargeScales;
        data = {
          lowerLimit: this.that.state.lowerLimit.replace(/,/g, ''),
          upperLimit: this.that.state.upperLimit.replace(/,/g, ''),
          rate: this.that.state.rate,
          type: this.that.state.type,
          id: this.that.state.chargeScaleId,
        };
        const index = scalesData.indexOf(data);
        scalesData.splice(index, 1, data);
        this.that.setState({
          chargeScales: scalesData,
        });
        break;

      case 'addReportParameter':
        const reportParameters = this.that.state.reportParams;
        data = {
          parameterName: this.that.state.parameterName,
          parameterType: this.that.state.parameterType,
          parameterAction: this.that.state.parameterAction,
          enumerationKey: this.that.state.enumerationKey,
          parameterUsers: this.that.state.userTypes,
          isRequired: this.that.state.isRequired,
          fieldName: this.that.state.fieldName,
          display: this.that.state.display,
          dateParameterValue: this.that.state.dateParameterValue,
        };

        reportParameters.push(data);

        this.that.setState({
          reportParams: reportParameters,
          parameterName: '',
          parameterType: '',
          parameterAction: '',
          enumerationKey: '',
          parameterUsers: [],
          selectedUserTypes: [],
          userTypes: [],
          isRequired: false,
        });
        break;

      default:
        break;
    }
  };

  handleEdit = (event, item, special) => {
    switch (special) {
      case 'recipientDelete':
        const data = this.that.state.recipients;
        const i = data.indexOf(item);
        data.splice(i, 1);

        this.that.setState({
          recipients: data,
        });
        break;
      default:
        break;
    }
  };

  handleArrayDelete = (e, data, special) => {
    let index;
    switch (special) {
      case 'recipientDetails':
        const details = this.that.state.recipientDetails;
        index = details.indexOf(data);
        details.splice(index, 1);

        this.that.setState({
          recipientDetails: details,
        });
        break;
      case 'smsDetails':
        const smsDetails = this.that.state.smsDetails;
        index = smsDetails.indexOf(data);
        smsDetails.splice(index, 1);

        this.that.setState({
          smsDetails,
        });
        break;
      case 'feeGraduatedScales':
        const feeSCaleData = this.that.state.feeGraduatedScales;
        const scaleindex = feeSCaleData.indexOf(data);
        feeSCaleData.splice(scaleindex, 1);

        this.that.setState({
          feeGraduatedScales: feeSCaleData,
        });
        break;
      case 'feeSplits':
        const feeSplitData = this.that.state.feeSplits;
        const splitIndex = feeSplitData.indexOf(data);
        feeSplitData.splice(splitIndex, 1);

        this.that.setState({
          feeSplits: feeSplitData,
        });
        break;
      case 'productGraduatedSacle':
        const productScaleData = this.that.state.graduatedScales;
        const productScaleIndex = productScaleData.indexOf(data);
        productScaleData.splice(productScaleIndex, 1);

        this.that.setState({
          graduatedScales: productScaleData,
        });
        break;
      default:
        break;
    }
  };

  onSelect = (selectedList, selectedItem) => {
    const data = [];
    selectedList.forEach((item) => {
      data.push(item.id);
    });
    this.that.setState({
      selectedBranches: selectedList,
      branchesID: data,
    });
  };

  onRemove = (selectedList, removedItem) => {
    const data = [];
    selectedList.forEach((item) => {
      data.push(item.id);
    });
    this.that.setState({
      selectedBranches: selectedList,
      branchesID: data,
    });
  };

  onSelectRole = (selectedList, selectedItem) => {
    const data = [];
    selectedList.forEach((item) => {
      data.push(item.roleId ? item.roleId : item.id);
    });
    this.that.setState({
      selectedRoles: selectedList,
      rolesID: data,
    });
  };

  onRemoveRole = (selectedList, removedItem) => {
    const data = [];
    selectedList.forEach((item) => {
      data.push(item.roleId ? item.roleId : item.id);
    });
    this.that.setState({
      selectedRoles: selectedList,
      rolesID: data,
    });
  };

  onSelectProductFee = (selectedList, selectedItem) => {
    const data = [];
    selectedList.forEach((item) => {
      data.push(item.id);
    });
    this.that.setState({
      selectedFees: selectedList,
      feesID: data,
    });
  };

  onRemoveProductFee = (selectedList, removedItem) => {
    const data = [];
    selectedList.forEach((item) => {
      data.push(item.id);
    });
    this.that.setState({
      selectedFees: selectedList,
      feesID: data,
    });
  };

  onSelectProductPenalty = (selectedList, selectedItem) => {
    const data = [];
    selectedList.forEach((item) => {
      data.push(item.id);
    });
    this.that.setState({
      selectedPenalties: selectedList,
      penaltiesID: data,
    });
  };

  onRemoveProductPenalty = (selectedList, removedItem) => {
    const data = [];
    selectedList.forEach((item) => {
      data.push(item.id);
    });
    this.that.setState({
      selectedPenalties: selectedList,
      penaltiesID: data,
    });
  };

  handleMenu = (e, special) => {
    const active = sessionStorage.getItem(special) === 'true';
    this.that.setState({
      menu: special,
    });
    sessionStorage.setItem('menu', special);
    sessionStorage.setItem(special, !active);
  };

  handleModal = (e) => {
    e.preventDefault();
    this.that.setState({
      modal: !this.that.state.modal,
    });
  };

  chunkify = (data, special) => {
    const len = data.length;
    const balanced = true;
    let n = special === 'reports' ? 4 : 2;
    const out = [];
    let i = 0;
    let size;

    if (len % n === 0) {
      size = Math.floor(len / n);
      while (i < len) {
        out.push(data.slice(i, (i += size)));
      }
    } else if (balanced) {
      while (i < len) {
        size = Math.ceil((len - i) / n--);
        out.push(data.slice(i, (i += size)));
      }
    } else {
      n--;
      size = Math.floor(len / n);
      if (len % size === 0) size--;
      while (i < size * n) {
        out.push(data.slice(i, (i += size)));
      }
      out.push(data.slice(size * n));
    }
    switch (special) {
      case 'modules':
        this.that.setState({
          sysModules1: out[0],
          sysModules2: out[1],
          systemModules: data,
        });
        break;
      case 'branches':
        this.that.setState({
          branches1: out[0],
          branches2: out[1],
          companyBranches: data,
        });
        break;
      case 'smsFields':
        this.that.setState({
          fields1: out[0],
          fields2: out[1],
          availableFields: data,
        });
        break;
      case 'reports':
        this.that.setState({
          reports1: out[0],
          reports2: out[1] === undefined ? [] : out[1],
          reports3: out[2] === undefined ? [] : out[2],
          reports4: out[3] === undefined ? [] : out[3],
          reports: data,
        });
        break;
      default:
        break;
    }
    return out;
  };

  handleClick = (event, area, action) => {
    const roles = sessionStorage.getItem('userRoles') === null
      ? ''
      : sessionStorage.getItem('userRoles');
    switch (area) {
      case 'users':
        switch (action) {
          case 'Can Create User':
            if (
              roles.includes(action)
              || parseInt(sessionStorage.getItem('userType'), 10) === 1
            ) {
            
            } else {
              this.that.props.history.push('/app/403');
            }

            break;
        default:
            break;
        }
        break;

      default:
        break;
    }
  };

  toggleClass = (e) => {
    e.preventDefault();
    const currentState = this.that.state.active;
    this.that.setState({ active: !currentState });
  };

  handlePhone = (value, country, e, formattedValue) => {
    const target = e.target;
    const name = target.name;
    this.that.setState({
      [name]:
        country.dialCode === '254'
        && String(value.slice(country.dialCode.length)).charAt(0) === '0'
          ? `${country.dialCode}${String(
            value.slice(country.dialCode.length),
          ).substring(1)}`
          : value,
    });

    if (value.length === 12) {
      switch (name) {
        case 'limitPhoneNumber':
          this.that.services.getCoreCustomer(value);
          this.that.services.getScoredMatrix(value);
          break;
        case 'customerPhoneNumber':
          this.that.services.checkCoreCustomer(value);

          break;

        default:
          break;
      }
    }
  };

  onDragStart = (ev, id) => {
    ev.dataTransfer.setData('id', `{${id}}`);
    ev.dataTransfer.setData('data', id.trim());
  };

  onDragOver = (ev) => {
    ev.preventDefault();
  };

  onDrop = (ev) => {
    const id = ev.dataTransfer.getData('id');

    const [start, end] = [
      document.getElementById('messageBody').selectionStart,
      document.getElementById('messageBody').selectionEnd,
    ];
    document
      .getElementById('messageBody')
      .setRangeText(id, start, end, 'select');

    this.that.setState({
      messageBody: document.getElementById('messageBody').value,
    });
  };

  setDate = (date, special) => {
    this.that.setState({
      [special]: date === null ? '' : date,
    });
    switch (special) {
      case 'collectionDate':
        this.that.services.getCollections(moment(date).format('YYYY-MM-DD'));
        break;
      case 'dueDate':
        if (parseInt(sessionStorage.getItem('userType'), 10) === 7) {
          this.that.services.getLoansDue(moment(date).format('YYYY-MM-DD'));
        } else if (parseInt(sessionStorage.getItem('userType'), 10) === 5) {
          this.that.services.getBranchLoansDue(moment(date).format('YYYY-MM-DD'));
        } else {
          this.that.services.getLoansDue(moment(date).format('YYYY-MM-DD'));
        }

        break;
      default:
        break;
    }
  };

  handleCancel = () => {
    this.that.props.history.goBack();
  };

  handleSort = (special, data) => {
    this.that.setState({
      sortValue: special,
      // showFilter: !this.that.state.showFilter,
    });
    let sortedData = data;

    sortedData = data.length !== 0
      ? this.that.state.sortValue === 'ASC'
        ? typeof data[0][`${this.that.state.column}`] === 'string'
          ? data
            .filter((d) => d[`${this.that.state.column}`] !== null)
            .sort((a, b) => a[`${this.that.state.column}`].localeCompare(
              b[`${this.that.state.column}`],
            ))
          : data
            .filter((d) => d[`${this.that.state.column}`] !== null)
            .sort(
              (a, b) => a[`${this.that.state.column}`]
                    - b[`${this.that.state.column}`],
            )
        : typeof data[0][`${this.that.state.column}`] === 'string'
          ? data
            .filter((d) => d[`${this.that.state.column}`] !== null)
            .sort((a, b) => b[`${this.that.state.column}`].localeCompare(
              a[`${this.that.state.column}`],
            ))
          : data
            .filter((d) => d[`${this.that.state.column}`] !== null)
            .sort(
              (a, b) => b[`${this.that.state.column}`]
                  - a[`${this.that.state.column}`],
            )
      : [];
  };

  handleError = (error) => {
    // eslint-disable-next-line no-console
    this.setIsLoading('false');
    // eslint-disable-next-line no-console
    console.log('This is the error: ', error);
    if (error.response) {
      const message = error.response.data.message || error.message || defErrorMessage;
      switch (error.response.status) {
        case 428:
          this.that.services.getToken();
          break;
        case 409:
          this.setMessage('error', error.response.data.errorMessage);
          break;
        case 401:
          if (window.location.pathname === '/') {
            const userId = Buffer.from(error.response.data.user.id).toString('base64');
            const companyId = Buffer.from(error.response.data.user.companyId).toString('base64');
            this.setMessage('error', error.response.data.message);
            // this.that.props.history.push(`/create-password/${userId}/${companyId}`);
            setTimeout(
              () => this.that.props.history.push(`/create-password/${userId}/${companyId}`),
              2000,
            );
          } else {
            this.that.props.history.push('/');
          }
          break;

        default:
          this.setMessage('error', message);
          break;
      }
    } else if (error.request) {
      // localStorage.setItem('error', error);
      this.that.props.history.push('/app/error-page');
    } else {
      // localStorage.setItem('error', error);
      this.that.props.history.push('/app/error-page');
    }
    this.timeOut(error, this);
  };

  handlePrint = (event, area) => {
    event.preventDefault();
    const divContents = document.getElementById(`${area}`).innerHTML;
    const a = window.open('', '', 'height=auto, width=auto');
    a.document.write(divContents);
    a.document.close();
    a.print();
  };

  viewImage = (event) => {
    event.preventDefault();
    const index = this.that.state.images.findIndex(
      (img) => img.src === event.target.src,
    );

    this.that.setState({
      currentImage: index,
      isOpen: true,
    });
  };

  closeImgsViewer = () => {
    this.that.setState({
      currentImage: 0,
      isOpen: false,
    });
  };

  gotoPrev = () => {
    this.that.setState({
      currentImage: this.that.state.currentImage - 1,
    });
  };

  gotoNext = () => {
    this.that.setState({
      currentImage: this.that.state.currentImage + 1,
    });
  };

  gotoImg = (index) => {
    this.that.setState({
      currentImage: index,
    });
  };

  handleClickImg = () => {
    if (this.that.state.currentImage === this.that.state.images.length - 1) {
      return;
    }
    this.gotoNext();
  };

  handleOffset = (offset, special) => {
    this.that.setState({ offset });
    switch (special) {
      case 'outbox':
        this.that.services.getCompanyOutbox(this.that.state.pageLimit, offset);
        break;
      case 'customers':
        this.that.services.getCompanyCustomers(
          this.that.state.pageLimit,
          offset,
          this.that.state.searchTerm,
        );
        break;
      case 'marketingLeads':
        this.that.services.getCompanyLeads(
          this.that.state.pageLimit,
          offset,
          this.that.state.leadsSearch,
        );
        break;
      case 'auditLogs':
        this.that.services.getCompanyLogs(
          this.that.state.pageLimit,
          offset,
          this.that.state.auditSearch,
        );
        break;
      case 'loanCustomerSearch':
        this.that.services.getApprovedCustomers(
          this.that.state.pageLimit,
          offset,
          this.that.state.loanCustomerSearch,
        );
        break;
      case 'loanSearch':
        this.that.services.getLoans(
          this.that.state.pageLimit,
          offset,
          this.that.state.loanSearch,
        );
        break;
      case 'marketSearch':
        this.that.services.getMarkets(
          this.that.state.pageLimit,
          offset,
          this.that.state.marketSearch,
          'paginated',
        );
        break;
      case 'followupcases':
        if (isNaN(this.that.state.currentPage) || this.that.state.currentPage === 1 || isNaN(offset)) {
          sessionStorage.setItem('FollowUpOffset', parseInt(window.location.href.split('/').pop(), 10));
          const off = parseInt(window.location.href.split('/').pop(), 10) === 1 ? 0 : parseInt(window.location.href.split('/').pop(), 10) * 10;
          this.that.services.getFollowUpCases(
            this.that.state.pageLimit,
            off,
            this.that.state.searchTermFollowUps,
            JSON.parse(sessionStorage.getItem('filtersToApply')),
          );
        } else {
          const off = parseInt(this.that.state.currentPage, 10) === 1 ? 0 : parseInt(this.that.state.currentPage, 10) * 10;
          sessionStorage.setItem('FollowUpOffset', off);
          this.that.services.getFollowUpCases(
            this.that.state.pageLimit,
            off,
            this.that.state.searchTermFollowUps,
            JSON.parse(sessionStorage.getItem('filtersToApply')),
          );
        }
        break;
      case 'followupallocation':
        this.that.services.getCustomerFollowUps(
          this.that.state.pageLimit,
          offset,
          this.that.state.allocationStatusFilter,
          this.that.state.searchTerm,
        );
        break;
      case 'rofollowupallocation':
        if (isNaN(offset)) {
          this.that.services.getLoanArrearsFollowUps(
            this.that.state.pageLimit,
            offset,
          );
        } else {
          this.that.services.getLoanArrearsFollowUps(
            this.that.state.pageLimit,
            offset,
          );
        }
        break;
      case 'rofollowupsescalated':
        if (isNaN(offset)) {
          this.that.services.getEscalatedFollowUps(
            this.that.state.pageLimit,
            offset,
            this.that.state.searchTerm,
          );
        } else {
          this.that.services.getEscalatedFollowUps(
            this.that.state.pageLimit,
            offset,
            this.that.state.searchTerm,
          );
        }
        break;
      case 'customerAccountStatement':
        if (this.that.state.currentPage === 1) {
          sessionStorage.setItem('customerStatementOffset', this.that.state.currentPage);
          this.that.services.getCustomerAccountStatement(
            this.that.state.customerFollowUpId,
            this.that.state.pageLimit,
            1,
          );
        } else if (!isNaN(this.that.state.currentPage) && this.that.state.currentPage !== 1 && !isNaN(offset)) {
          sessionStorage.setItem('customerStatementOffset', this.that.state.currentPage);
          this.that.services.getCustomerAccountStatement(
            this.that.state.customerFollowUpId,
            this.that.state.pageLimit,
            parseInt(this.that.state.currentPage, 10),
          );
        } else {
          this.that.services.getCustomerAccountStatement(
            this.that.state.customerFollowUpId,
            this.that.state.pageLimit,
            parseInt(sessionStorage.getItem('customerStatementOffset'), 10),
          );
        }
        break;
      default:
        break;
    }
  };

  handleCurrentPage = (currentPage) => {
    this.that.setState({
      currentPage,
    });
  };

  handleFilter = (column) => {
    let selected = [];
    if (this.that.state.criteria.length > 0) {
      const crit = this.that.state.criteria.filter(
        (criteria) => criteria.title === column,
      )[0];
      if (crit !== undefined) {
        selected = crit.fields;
      }
    }
    this.that.setState({
      showFilter: true,
      column,
      selected,
    });
  };

  toTitleCase = (str) => str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );

  splitCamelCase = (str) => str // insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
  // uppercase the first character
    .replace(/^./, (s) => s.toUpperCase());

  uniqueArray = (value, index, self) => self.indexOf(value) === index;

  handleRowClick = (e, rowData) => {
    const myRoles = sessionStorage.getItem('userRoles') === null
      ? ''
      : sessionStorage.getItem('userRoles');
    rowData.tableData.checked = !rowData.tableData.checked;
    // call the onSelectionChange and pass it the row selected to ensure it updates your selection properly for any custom onSelectionChange functions.
    this.that.state.tableRef.current.onSelectionChange(rowData);
    this.that.setState({
      rowId: rowData.length === 0 ? '' : rowData.tableData.id,
      selectedItems: rowData,
    });

    if (myRoles.includes('Can Create Follow Up Notes')) {
      this.that.props.history.push(`/app/create-follow-up-note/${this.that.state.currentPage}/${rowData.id}`);
    } else {
      this.setMessage('error', 'No Rights to view Page');
    }
    sessionStorage.setItem('rowId', rowData.length === 0 ? '' : rowData.tableData.id);
  };

  handleDownload = (e, format, special) => {
    e.preventDefault();
    switch (special) {
      case 'reports':
        let path = this.that.state.reportPath;
        switch (format) {
          case 'pdf':
            path = `${path}&rs:Format=PDF`;

            this.that.setState({
              reportPath: path,
            });

            setTimeout(() => this.that.setState({
              reportPath: sessionStorage.getItem('reportPath'),
            }), 1000);
            break;
          case 'excel':
            path = `${path}&rs:Format=EXCEL`;

            this.that.setState({
              reportPath: path,
            });
            setTimeout(() => this.that.setState({
              reportPath: sessionStorage.getItem('reportPath'),
            }), 1000);
            break;
          case 'word':
            path = `${path}&rs:Format=WORD`;

            this.that.setState({
              reportPath: path,
            });
            setTimeout(() => this.that.setState({
              reportPath: sessionStorage.getItem('reportPath'),
            }), 1000);
            break;
          case 'image':
            path = `${path}&rs:Format=IMAGE`;

            this.that.setState({
              reportPath: path,
            });
            setTimeout(() => this.that.setState({
              reportPath: sessionStorage.getItem('reportPath'),
            }), 1000);
            break;
          case 'csv':
            path = `${path}&rs:Format=CSV`;

            this.that.setState({
              reportPath: path,
            });
            setTimeout(() => this.that.setState({
              reportPath: sessionStorage.getItem('reportPath'),
            }), 1000);
            break;

          default:
            break;
        }
        break;

      default:
        break;
    }
  };
}

export default Functions;
