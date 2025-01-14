import React from 'react';
import VernieSVG from '../../../style/VernieHappy.svg'
const VernieSVGUrl = `data:image/svg+xml;base64,${btoa(VernieSVG)}`;


const VernieComponent: React.FC = () => {
  return (
    <div>
      <img src={VernieSVGUrl} alt="Vernie happy face" height="75px"/>
    </div>
  );
};

export default VernieComponent;