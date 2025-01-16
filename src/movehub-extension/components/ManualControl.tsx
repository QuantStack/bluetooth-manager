import caretUpSVG from '../../../style/caret-up.svg';
import caretDownSVG from '../../../style/caret-down.svg';
import caretLeftSVG from '../../../style/caret-left.svg';
import caretRightSVG from '../../../style/caret-right.svg';
import emptySVG from '../../../style/empty.svg';
import stopButtonSVG from '../../../style/stop-button.svg';
import { MoveHub } from '../moveHub';
const emptySVGUrl = `data:image/svg+xml;base64,${btoa(emptySVG)}`;
const stopButtonSVGUrl = `data:image/svg+xml;base64,${btoa(stopButtonSVG)}`;
const caretUpSVGUrl = `data:image/svg+xml;base64,${btoa(caretUpSVG)}`;
const caretDownSVGUrl = `data:image/svg+xml;base64,${btoa(caretDownSVG)}`;
const caretLeftSVGUrl = `data:image/svg+xml;base64,${btoa(caretLeftSVG)}`;
const caretRightSVGUrl = `data:image/svg+xml;base64,${btoa(caretRightSVG)}`;

interface IManualControlProps {
  moveHub: MoveHub;
}

export default function ManualControl(props: IManualControlProps) {
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
        //await this.props.moveHub.driveToDirection();
        await props.moveHub.hub.driveToDirection(1);
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
        await props.moveHub.hub.turn(-90);
      }
    },
    {
      id: 5,
      src: stopButtonSVGUrl,
      alt: 'Image 5',
      handleClick: async () => {
        props.moveHub.stop();
      }
    },
    {
      id: 6,
      src: caretRightSVGUrl,
      alt: 'Image 6',
      handleClick: async () => {
        props.moveHub.hub.turn(90);
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
      handleClick: async () => await props.moveHub.hub.driveToDirection(0)
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
    <div className="manual-control-container">
      <div className="move-input-field-text">
        <h4>Drive the robot with the buttons</h4>
      </div>
      <div className="manual-control-grid">
        {images.map(image => (
          <div className="manual-control-grid-item">
            <button
              key={image.id}
              onClick={image.handleClick} // Use the custom handleClick for each image
              className="image-button"
            >
              <img src={image.src} alt={image.alt} className="image" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
