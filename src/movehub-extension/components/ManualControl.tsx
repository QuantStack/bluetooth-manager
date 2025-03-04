import { MoveHub } from '../moveHub';
import caretUpSVG from '../../../style/caret-up.svg';
import caretDownSVG from '../../../style/caret-down.svg';
import caretLeftSVG from '../../../style/caret-left.svg';
import caretRightSVG from '../../../style/caret-right.svg';
import emptySVG from '../../../style/empty.svg';
import stopButtonSVG from '../../../style/stop-button.svg';
const emptySVGUrl = `data:image/svg+xml;base64,${btoa(emptySVG)}`;
const stopButtonSVGUrl = `data:image/svg+xml;base64,${btoa(stopButtonSVG)}`;
const caretUpSVGUrl = `data:image/svg+xml;base64,${btoa(caretUpSVG)}`;
const caretDownSVGUrl = `data:image/svg+xml;base64,${btoa(caretDownSVG)}`;
const caretLeftSVGUrl = `data:image/svg+xml;base64,${btoa(caretLeftSVG)}`;
const caretRightSVGUrl = `data:image/svg+xml;base64,${btoa(caretRightSVG)}`;

export interface IMoveHubControlProps {
  moveHub: MoveHub;
}

export default function ManualControl({ moveHub }: IMoveHubControlProps) {
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
      src: caretUpSVGUrl,
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
      src: caretLeftSVGUrl,
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
      src: caretRightSVGUrl,
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
      src: caretDownSVGUrl,
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
