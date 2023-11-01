import React from 'react';
import {
  Card, Button,
} from 'react-bootstrap';

class InfoMessage extends React.Component {
  render() {
    return (
      <Card id="info-box" className="infomessage-card text-center hide">
        <Card.Header className="header">NEW VERSION AVAILABLE</Card.Header>
        <Card.Body>
          <Card.Text>
            A new version of the application is available.
          </Card.Text>
          <Button variant="primary" id="update-installer">Refresh</Button>
        </Card.Body>
      </Card>
    );
  }
}

export default InfoMessage;
