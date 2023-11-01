/* eslint-disable max-len */
import React from 'react';
import GoogleMapReact from 'google-map-react';

function DefaultMarkar() {
  return (
    <div
      style={{
        background: '#2962ff',
        padding: '8px 8px',
        display: 'inline-flex',
        borderRadius: '50%',
      }}
    />
  );
}

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const defaultCenter = {
      lat: parseFloat(this.props.latitude) === 'NaN' ? 43.653876 : parseFloat(this.props.latitude),
      lng: parseFloat(this.props.longitude) === 'NaN' ? -79.383666 : parseFloat(this.props.longitude),
    };
    const center = {
      lat: parseFloat(this.props.latitude) === 'NaN' ? 43.65 : parseFloat(this.props.latitude),
      lng: parseFloat(this.props.longitude) === 'NaN' ? -79.38 : parseFloat(this.props.longitude),
    };

    return (
      <div className="card mb-4">
        <div className="card-body">
          <div className="map-content">
            <GoogleMapReact
              bootstrapURLKeys={{
                key: 'AIzaSyBKC3NZ4Ob6woQrncGUJIhyhslu8kQqd_8',
              }}
              defaultCenter={defaultCenter}
              center={center}
              zoom={15}
            >
              <DefaultMarkar
                lat={this.props.latitude}
                lng={this.props.longitude}
              />
            </GoogleMapReact>
          </div>
        </div>
      </div>
    );
  }
}

export default MapContainer;
