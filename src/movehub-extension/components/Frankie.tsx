import FrankieSVG from '../../../style/FrankieSchematic.svg';

const FrankieSVGUrl = `data:image/svg+xml;base64,${btoa(FrankieSVG)}`;

export default function Frankie () {
  return (
    <div>
      <img src={FrankieSVGUrl} alt="Frankie schematics" height="200px" />
    </div>
  );
};
