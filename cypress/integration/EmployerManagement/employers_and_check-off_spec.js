/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';
const employeeUploadDir = './cypress/upload/sampleEmployeeUploadFile.xlsx';
const checkoffUploadDir = './cypress/upload/sampleCheckOffUploadFile.xlsx';
const fakeEmployerName = `test ${faker.random.word()}`.toUpperCase();

describe('Employers end to end test', () => {
  it('User can create employers', () => {
    /* User logs in */
    cy.visit(`${BASE_URL}`);
    cy.findByRole('textbox', { name: /email address/i }).type('geoffrey.otieno@opentechglobal.co.ke');
    cy.findByLabelText(/password/i).type('Geolen@2013');
    cy.findByRole('button', { name: /sign in/i }).click();
    cy.intercept(
      {
        method: 'GET',
        url: `${BACKEND_URL}/api/v1/users/email/${Buffer.from('geoffrey.otieno@opentechglobal.co.ke').toString('base64')}`,
      },
    ).as('getUserData');
    cy.wait(['@getUserData']);
    cy.visit(`${BASE_URL}/app/employers`);
    cy.wait(2000);

    // company information
    cy.findByRole('link', { name: /create employer/i }).click();
    cy.get('#employerName').type(fakeEmployerName);
    cy.get('#phoneNumber').type(faker.random.numeric(9));
    cy.get('#email').type(faker.internet.email());
    cy.get('#relationshipOfficerId').type('Josephat Mutisya').findByText('Josephat Mutisya').click();
    cy.get('#postalAddress').type(faker.random.numeric(2));
    cy.get('#postalCode').type(faker.random.numeric(4));
    cy.get('#companyPin').type(faker.random.alphaNumeric(10));
    cy.get('#physicalAddress').type(faker.address.streetAddress());
    cy.findByRole('button', { name: /next/i }).click();

    // Profession
    cy.get('#industryType').select('Business & Information');
    cy.get('#businessType').select('Video Production');
    cy.get('#businessDescription').type('business legit');
    cy.findByRole('button', { name: /next/i }).click();

    // Contact details
    cy.get('#contactFirstName').type(faker.name.firstName());
    cy.get('#contactLastName').type(faker.name.lastName());
    cy.get('#contactPhone').type(faker.random.numeric(9));
    cy.get('#contactEmail').type(faker.internet.email());
    cy.findByRole('button', { name: /next/i }).click();

    // confirm and save
    cy.findByRole('button', { name: /save/i }).click();

    cy.url().should('contain', '/app/employers');
  });

  it('User Can Approve Employer', () => {
    cy.visit(`${BASE_URL}/app/employers`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)
      > div > div > div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1)
       > td:nth-child(7) > div > button:nth-child(3) > span:nth-child(1) > svg`).click({ force: true });
    cy.url().should('contain', '/app/approve-employer/');
    cy.get('#approvalRemarks').scrollIntoView();
    cy.get('#approvalRemarks').type('approved');
    cy.get('#recordStatus').select('Approve');
    cy.findByRole('button', { name: /save/i }).click();
    cy.url().should('contain', '/app/employers');
  });

  it('User Can Upload Employees', () => {
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div >
     div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > 
     div > button:nth-child(4) > span:nth-child(1) > svg`).click({ force: true });
    cy.get('#employeeUploadExcel').selectFile(employeeUploadDir, { action: 'drag-drop' });

    cy.findByRole('button', { name: /upload/i }).click();
    cy.wait(3000);
  });

  it('User Can View And Approve Employees', () => {
    cy.visit(`${BASE_URL}/app/employers`);
    cy.wait(2000);
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div >
     div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) >
      div > button:nth-child(3) > span:nth-child(1) > svg`).click({ force: true });
    cy.findByRole('checkbox').check();
    cy.findByRole('button', { name: /approve cases/i }).click();
    cy.wait(2000);
    cy.findByRole('tab', { name: /approved employees/i }).click();
  });

  it('User Can View And Upload Checkoffs', () => {
    cy.visit(`${BASE_URL}/app/view-checkoff-uploads`);
    cy.wait(2000);
    cy.findByRole('link', { name: /upload checkoff file/i }).click();
    cy.get('#employerId').select(fakeEmployerName);
    cy.get('#checkOffUploadExcel').selectFile(checkoffUploadDir, { action: 'drag-drop' });
    cy.findByRole('button', { name: /upload/i }).click();
    cy.get(`#root > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div >
     div:nth-child(2) > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(9) > 
     div > button > span:nth-child(1) > svg`).click({ force: true });
    cy.findByRole('checkbox').check();
    cy.findByRole('button', { name: /approve cases/i }).click();
    cy.wait(2000);
    cy.findByRole('tab', { name: /approved items/i }).click();
  });
});
