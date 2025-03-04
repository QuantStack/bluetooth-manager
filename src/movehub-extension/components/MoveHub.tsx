import MoveHubSVG from '../../../style/MoveHub.svg';
const MoveHubSVGUrl = `data:image/svg+xml;base64,${btoa(MoveHubSVG)}`;

export default function MoveHub ()  {
  return (
    <div>
      <img src={MoveHubSVGUrl} alt="Move Hub schematics" height="160px" />
    </div>
  );
};
