/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { faker } from '@faker-js/faker';
import moment from 'moment';

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';

describe('Bulk SMS test', () => {
  it('User Can Create Bulk Call Center SMS', () => {
    cy.visit(`${BASE_URL}`);
    cy.findByRole('textbox', { name: /Email Address/i }).type(
      'makena.mugendi@opentechglobal.co.ke',
    );
    cy.findByLabelText(/password/i).type('Nshangika@3450');
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.intercept(
      {
        method: 'GET',
        url: `${BACKEND_URL}/api/v1/users/email/${Buffer.from('makena.mugendi@opentechglobal.co.ke').toString('base64')}`,
      },
    ).as('getUserData');
    cy.wait(['@getUserData']);
    cy.visit(`${BASE_URL}/app/call-centre-sms`);
    cy.wait(2000);

    cy.get('#recipientType').select('Call Centre Customers');
    cy.get('#branchId').select('MACHAKOS');
    cy.get('#startDays').type('15');
    cy.get('#endDays').type('50');
    cy.findByRole('button', { name: /next/i }).click();

    cy.wait(4000);
    cy.get('#existingTemplate').select('INSTALMENT');
    cy.get('#messageType').select('Scheduled');
    cy.get('#scheduledDate').type(moment(new Date()).format('DD/MM/YYYY hh:mm A'));
    cy.findByRole('button', { name: /next/i }).click();
    cy.wait(4000);
    cy.findByRole('button', { name: /save/i }).click();

    cy.url().should('contain', '/app/follow-up-cases/1');
    cy.wait(2000);
  });

  it('User Can Create Bulk PTP SMS', () => {
    cy.visit(`${BASE_URL}/app/call-centre-sms`);
    cy.wait(2000);

    cy.get('#recipientType').select('Promised to Pay');
    cy.get('#ptpStart').type(moment(new Date()).subtract(2, 'months').format('DD/MM/YYYY'));
    cy.get('#ptpEnd').type(moment(new Date()).format('DD/MM/YYYY'));
    cy.findByRole('button', { name: /next/i }).click();
    cy.wait(4000);
    cy.get('#existingTemplate').select('INSTALMENT');
    cy.get('#messageType').select('Direct');
    cy.findByRole('button', { name: /next/i }).click();
    cy.wait(4000);
    cy.findByRole('button', { name: /save/i }).click();

    cy.url().should('contain', '/app/follow-up-cases/1');
    cy.wait(2000);
  });
});
