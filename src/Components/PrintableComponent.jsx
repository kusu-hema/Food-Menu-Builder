import React from 'react';

const PrintableComponent = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <h1>Invoice</h1>
    <p>This is the content that will be printed.</p>
  </div>
));

export default PrintableComponent;
