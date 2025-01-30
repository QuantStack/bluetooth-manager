import React from 'react';
import VernieSVG from '../../../style/VernieSchematic.svg'
const VernieSVGUrl = `data:image/svg+xml;base64,${btoa(VernieSVG)}`;


const VernieComponent: React.FC = () => {
  return (
    <div>
      <img src={VernieSVGUrl} alt="Vernie schematics" height="200px"/>
    </div>
  );
};

export default VernieComponent;