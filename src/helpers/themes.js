const theme = {
  // container
  container: {
    background: 'rgba(255, 255, 255, .9)',
  },

  // arrows
  arrow: {
    backgroundColor: 'rgba(255, 255, 255, .8)',
    fill: '#222',
    opacity: 0.6,
    transition: 'opacity 200ms',

    ':hover': {
      opacity: 1,
    },
  },
  arrow__size__medium: {
    borderRadius: 40,
    height: 40,
    marginTop: -20,

    '@media (min-width: 768px)': {
      height: 70,
      padding: 15,
    },
  },
  arrow__direction__left: { marginLeft: 10 },
  arrow__direction__right: { marginRight: 10 },
  close: {
    fill: '#d40000',
    opacity: 0.6,
    transition: 'all 200ms',
    ':hover': {
      opacity: 1,
    },
  },

  // footer
  footer: {
    color: '#000',
  },
  footerCount: {
    color: 'rgba(0, 0, 0, .6)',
  },

  figure: {
    cursor: 'pointer',
    maxHeight: 'calc(50vh - 50px)',
  },

  // thumbnails
  thumbnail: {

  },
  thumbnail__active: {
    boxShadow: '0 0 0 2px #00d8ff',
  },
};

export default { theme };
