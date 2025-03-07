import { MoveHub } from '../moveHub';
import arrowUpSVG from '../../../style/arrow-up.svg';
import arrowDownSVG from '../../../style/arrow-down.svg';
import turnLeftSVG from '../../../style/turn-left.svg';
import turnRightSVG from '../../../style/turn-right.svg';
import stopButtonSVG from '../../../style/stop-button.svg';
const stopButtonSVGUrl = `data:image/svg+xml;base64,${btoa(stopButtonSVG)}`;
const arrowUpSVGUrl = `data:image/svg+xml;base64,${btoa(arrowUpSVG)}`;
const arrowDownSVGUrl = `data:image/svg+xml;base64,${btoa(arrowDownSVG)}`;
const turnLeftSVGUrl = `data:image/svg+xml;base64,${btoa(turnLeftSVG)}`;
const turnRightSVGUrl = `data:image/svg+xml;base64,${btoa(turnRightSVG)}`;

export interface IMoveHubControlProps {
  moveHub: MoveHub;
}

export function ManualControl2({ moveHub }: IMoveHubControlProps) {
  const images = [

    {
      id: 1,
      src: arrowUpSVGUrl,
      alt: 'Image 1',
      handleClick: async () => {
        await moveHub.hub.driveToDirection(1);
      }
    },
    {
      id: 2,
      src: turnLeftSVGUrl,
      alt: 'Image 2',
      handleClick: async () => {
        await moveHub.hub.turn(-90);
      }
    },
    {
      id: 3,
      src: turnRightSVGUrl,
      alt: 'Image 3',
      handleClick: async () => {
        moveHub.hub.turn(90);
      }
    },
    {
      id: 4,
      src: arrowDownSVGUrl,
      alt: 'Image 4',
      handleClick: async () => await moveHub.hub.driveToDirection(0)
    },
    {
      id: 5,
      src: stopButtonSVGUrl,
      alt: 'Image 5',
      handleClick: async () => {
        moveHub.stop();
      }
    },
  ];

  return (
    <div className="manual-control-grid2">
      {images.map((image, index) => (
        <div className='manual-control-grid-item'>
          <button
            key={index}
            onClick={image.handleClick}
            className="image-button"
          >
            <img src={image.src} alt={image.alt} />
          </button>
        </div>
      ))}

    </div>
  );
}
