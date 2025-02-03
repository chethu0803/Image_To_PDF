import React from 'react';

const PDFViewer = ({ pdfUrl }) => {
  return (
    <div style={styles.container}>
      <div style={styles.viewer}>
        <h2 style={styles.heading}>PDF Preview</h2>
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="PDF Viewer"
          style={styles.iframe}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  viewer: {
    width: '60%', 
    maxWidth: '800px', 
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '10px',
  },
  iframe: {
    border: 'none',
    borderRadius: '5px',
  },
};

export default PDFViewer;
