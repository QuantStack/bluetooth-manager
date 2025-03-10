import { MoveHub } from '../moveHub';
import arrowUpSVG from '../../../style/arrow-up.svg';
import arrowDownSVG from '../../../style/arrow-down.svg';
import turnLeftSVG from '../../../style/turn-left.svg';
import turnRightSVG from '../../../style/turn-right.svg';
import emptySVG from '../../../style/empty.svg';
import stopButtonSVG from '../../../style/stop-button.svg';
const emptySVGUrl = `data:image/svg+xml;base64,${btoa(emptySVG)}`;
const stopButtonSVGUrl = `data:image/svg+xml;base64,${btoa(stopButtonSVG)}`;
const arrowUpSVGUrl = `data:image/svg+xml;base64,${btoa(arrowUpSVG)}`;
const arrowDownSVGUrl = `data:image/svg+xml;base64,${btoa(arrowDownSVG)}`;
const turnLeftSVGUrl = `data:image/svg+xml;base64,${btoa(turnLeftSVG)}`;
const turnRightSVGUrl = `data:image/svg+xml;base64,${btoa(turnRightSVG)}`;

export interface IMoveHubControlProps {
  moveHub: MoveHub;
}

export function ManualControl({ moveHub }: IMoveHubControlProps) {
  const images = [
    {
      id: 1,
      src: emptySVGUrl,
      alt: 'Image 1',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    },
    {
      id: 2,
      src: arrowUpSVGUrl,
      alt: 'Image 2',
      handleClick: async () => {
        await moveHub.hub.driveToDirection(1);
      }
    },
    {
      id: 3,
      src: emptySVGUrl,
      alt: 'Image 3',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    },
    {
      id: 4,
      src: turnLeftSVGUrl,
      alt: 'Image 4',
      handleClick: async () => {
        await moveHub.hub.turn(-90);
      }
    },
    {
      id: 5,
      src: stopButtonSVGUrl,
      alt: 'Image 5',
      handleClick: async () => {
        moveHub.stop();
      }
    },
    {
      id: 6,
      src: turnRightSVGUrl,
      alt: 'Image 6',
      handleClick: async () => {
        moveHub.hub.turn(90);
      }
    },
    {
      id: 7,
      src: emptySVGUrl,
      alt: 'Image 7',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    },
    {
      id: 8,
      src: arrowDownSVGUrl,
      alt: 'Image 8',
      handleClick: async () => await moveHub.hub.driveToDirection(0)
    },
    {
      id: 9,
      src: emptySVGUrl,
      alt: 'Image 9',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    }
  ];

  return (
    <div className="manual-control-grid">
      {images.map((image, index) => (
        <div className="manual-control-grid-item">
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