import VernieSVG from '../../../style/VernieSchematic.svg';
const VernieSVGUrl = `data:image/svg+xml;base64,${btoa(VernieSVG)}`;

export default function Vernie() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img src={VernieSVGUrl} alt="Vernie schematics" height="250px" />
    </div>
  );
}
