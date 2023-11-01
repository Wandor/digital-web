/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import { faker } from '@faker-js/faker';
import moment from 'moment';

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const newLead = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phoneNumber: faker.phone.phoneNumber('+254#########'),
  idNumber: faker.random.numeric(8),
  businessLocation: faker.lorem.sentence(3),
  industryType: '6748e5c0-8978-45d7-ac1b-e170babb24b3',
  businessType: '00afa960-a866-4dbd-92e8-e8368a36cb9d',
  nextVisitDate: tomorrow,
  branchId: faker.datatype.uuid(),
  companyId: faker.datatype.uuid(),
  createdBy: faker.datatype.uuid(),
};

describe('Marketing Leads', () => {
  it('User can create marketing lead', () => {
    /* User logs in */
    cy.visit('http://localhost:3000');
    cy.findByRole('button', { name: /proceed with password/i }).click();
    cy.findByRole('textbox', { name: /Email Address/i }).type(
      'jonniesaba@gmail.com',
    );
    cy.findByLabelText(/password/i).type('0742551985');
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.intercept('POST', 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyC5zornGzxXH5tuw2weNLCJyHfQV7bSobE').as('verifyUser');

    cy.intercept('GET', `https://testdfa.rahisi.co/api/v1/users/email/${Buffer.from('jonniesaba@gmail.com').toString('base64')}`).as('getUserData');

    cy.wait('@verifyUser').then((interception) => {
      window.sessionStorage.setItem('AuthToken', interception.response.body.idToken);
      window.sessionStorage.setItem('email', interception.response.body.email);
    });

    cy.wait('@getUserData').then((interception) => {
      const json = Buffer.from(interception.response.body.userData, 'base64').toString(
        'ascii',
      );

      const jsonData = JSON.parse(json);

      window.sessionStorage.setItem('userRoles', JSON.stringify(jsonData.userRoles));
      window.sessionStorage.setItem(
        'userCompany',
        jsonData.companyUsers.CompanyName,
      );
      window.sessionStorage.setItem('userType', jsonData.userType);
      window.sessionStorage.setItem('hostUserId', jsonData.hostUserId);
      window.sessionStorage.setItem('companyId', jsonData.companyId);
      window.sessionStorage.setItem('coreDB', jsonData.companyUsers.coreDatabaseName);
      window.sessionStorage.setItem('authDB', jsonData.companyUsers.authDatabaseName);

      window.sessionStorage.setItem('defaultBranch', jsonData.branchId);

      window.sessionStorage.setItem('userName', jsonData.firstName);
      window.sessionStorage.setItem('userId', jsonData.id);
      window.sessionStorage.setItem(
        'relationshipOfficerId',
        jsonData.relationshipOfficerId,
      );
    });

    /* Navigates to create new lead */
    cy.visit('http://localhost:3000/app/create-lead');

    /*  User creates a new lead */

    cy.findByLabelText(/first name/i).type(newLead.firstName);
    cy.findByRole('textbox', { name: /last name/i }).type(newLead.lastName);
    cy.findByRole('textbox', { name: /phone number/i }).type(newLead.phoneNumber);
    cy.findByRole('textbox', { name: /id number/i }).type(newLead.idNumber);
    cy.findByRole('combobox', { name: /industry type/i }).select(newLead.industryType);
    cy.findByRole('combobox', { name: /business type/i }).select(newLead.businessType);
    cy.findByRole('textbox', { name: /business location/i }).type(newLead.businessLocation);
    cy.findByRole('combobox', { name: /branch/i }).select(window.sessionStorage.getItem('defaultBranch'));
    cy.findByRole('textbox', { name: /next visit date/i }).type(moment(newLead.nextVisitDate).format('DD/MM/YYYY'));

    // cy.spy(Functions.prototype.handleClick())
    cy.findByRole('button', {
      name: /save/i,
    }).click();
    // cy.findByRole('button', {
    //   name: /save/i,
    // }).click().then(() => {
    //   cy.request('POST', `${Cypress.env('REACT_APP_HOST')}/api/v1/marketingLeads`, { ...newLead })
    //     .then((response) => {
    //       // response.body is automatically serialized into JSON
    //       expect(response.body).to.have.property('firstName', newLead.firstName); // true
    //     });
    // });
  });
});
