import React from 'react';
import FrankieSVG from '../../../style/FrankieSchematic.svg'
const FrankieSVGUrl = `data:image/svg+xml;base64,${btoa(FrankieSVG)}`;


const FrankieComponent: React.FC = () => {
  return (
    <div>
      <img src={FrankieSVGUrl} alt="Frankie schematics" height="300px"/>
    </div>
  );
};

export default FrankieComponent;