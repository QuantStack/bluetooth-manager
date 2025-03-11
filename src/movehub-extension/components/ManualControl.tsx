import { MoveHub } from '../moveHub';
import arrowUpSVG from '../../../style/arrow-up.svg';
import arrowDownSVG from '../../../style/arrow-down.svg';
import turnLeftSVG from '../../../style/turn-left1.svg';
import turnRightSVG from '../../../style/turn-right1.svg';
import halfTurnLeftSVG from '../../../style/half-turn-left.svg';
import halfTurnRightSVG from '../../../style/half-turn-right.svg';
import threeQuartersOfTurnDirectSVG from '../../../style/three-quarters-of-turn-direct.svg';
import threeQuartersOfTurnIndirectSVG from '../../../style/three-quarters-of-turn-indirect.svg';
import fullTurnDirectSVG from '../../../style/full-turn-direct.svg';
import fullTurnIndirectSVG from '../../../style/full-turn-indirect.svg';
import emptySVG from '../../../style/empty.svg';
import stopButtonSVG from '../../../style/stop-button.svg';
const emptySVGUrl = `data:image/svg+xml;base64,${btoa(emptySVG)}`;
const stopButtonSVGUrl = `data:image/svg+xml;base64,${btoa(stopButtonSVG)}`;
const arrowUpSVGUrl = `data:image/svg+xml;base64,${btoa(arrowUpSVG)}`;
const arrowDownSVGUrl = `data:image/svg+xml;base64,${btoa(arrowDownSVG)}`;
const turnLeftSVGUrl = `data:image/svg+xml;base64,${btoa(turnLeftSVG)}`;
const turnRightSVGUrl = `data:image/svg+xml;base64,${btoa(turnRightSVG)}`;
const halfTurnLeftSVGUrl = `data:image/svg+xml;base64,${btoa(halfTurnLeftSVG)}`;
const halfTurnRightSVGUrl = `data:image/svg+xml;base64,${btoa(halfTurnRightSVG)}`;
const fullTurnDirectSVGUrl = `data:image/svg+xml;base64,${btoa(fullTurnDirectSVG)}`;
const threeQuartersOfTurnDirectSVGUrl = `data:image/svg+xml;base64,${btoa(threeQuartersOfTurnDirectSVG)}`;
const threeQuartersOfTurnIndirectSVGUrl = `data:image/svg+xml;base64,${btoa(threeQuartersOfTurnIndirectSVG)}`;
const fullTurnIndirectSVGUrl = `data:image/svg+xml;base64,${btoa(fullTurnIndirectSVG)}`;

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


export function ManualControl1({ moveHub }: IMoveHubControlProps) {
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
      src: emptySVGUrl,
      alt: 'Image 2',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    },
    {
      id: 3,
      src: arrowUpSVGUrl,
      alt: 'Image 3',
      handleClick: async () => {
        await moveHub.hub.driveToDirection(1);
      }
    },
    {
      id: 4,
      src: emptySVGUrl,
      alt: 'Image 4',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    },
    {
      id: 5,
      src: emptySVGUrl,
      alt: 'Image 5',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    },
    {
      id: 6,
      src: halfTurnLeftSVGUrl,
      alt: 'Image 4',
      handleClick: async () => {
        await moveHub.hub.turn(-180);

      },
    },
    {
      id: 7,
      src: turnLeftSVGUrl,
      alt: 'Image 4',
      handleClick: async () => {
        await moveHub.hub.turn(-90);
      }
    },
    {
      id: 8,
      src: stopButtonSVGUrl,
      alt: 'Image 9',
      handleClick: async () => {
        moveHub.stop();
      }
    },
    {
      id: 9,
      src: turnRightSVGUrl,
      alt: 'Image 9',
      handleClick: async () => {
        moveHub.hub.turn(90);
      }
    },
    {
      id: 10,
      src: halfTurnRightSVGUrl,
      alt: 'Image 10',
      handleClick: async () => {
        moveHub.hub.turn(180);
      }
    },
    {
      id: 11,
      src: emptySVGUrl,
      alt: 'Image 11',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    },
    {
      id: 12,
      src: emptySVGUrl,
      alt: 'Image 12',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    },
    {
      id: 13,
      src: arrowDownSVGUrl,
      alt: 'Image 13',
      handleClick: async () => await moveHub.hub.driveToDirection(0)
    },
    {
      id: 14,
      src: emptySVGUrl,
      alt: 'Image 14',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    },
    {
      id: 15,
      src: emptySVGUrl,
      alt: 'Image 15',
      handleClick: () => {
        console.error('Inactive button, no control available.');
      }
    }
  ];

  return (
    <div className="manual-control-grid2">
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
      id:2,
      src: arrowDownSVGUrl,
      alt: 'Image 2',
      handleClick: async () => await moveHub.hub.driveToDirection(0)
    },


    {
      id: 3,
      src: stopButtonSVGUrl,
      alt: 'Image 3',
      handleClick: async () => {
        moveHub.stop();
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
      src: halfTurnLeftSVGUrl,
      alt: 'Image 5',
      handleClick: async () => {
        await moveHub.hub.turn(-180);

      },
    },
    {
      id: 6,
      src: threeQuartersOfTurnDirectSVGUrl,
      alt: 'Image 6',
      handleClick: async () => {
        await moveHub.hub.turn(-270);

      },
    },
    {
      id: 7,
      src: fullTurnDirectSVGUrl,
      alt: 'Image 7',
      handleClick: async () => {
        await moveHub.hub.turn(-360);

      },
    },
   
    {
      id: 8,
      src: turnRightSVGUrl,
      alt: 'Image 8',
      handleClick: async () => {
        moveHub.hub.turn(90);
      }
    },
    {
      id: 9,
      src: halfTurnRightSVGUrl,
      alt: 'Image 9',
      handleClick: async () => {
        moveHub.hub.turn(180);
      }
    },
    {
      id: 10,
      src:threeQuartersOfTurnIndirectSVGUrl,
      alt: 'Image 10',
      handleClick: async () => {
        moveHub.hub.turn(180);
      }
    },
    {
      id: 11,
      src:fullTurnIndirectSVGUrl,
      alt: 'Image 11',
      handleClick: async () => {
        moveHub.hub.turn(360);
      }
    },
    
  ];

  return (
    <div className="manual-control-grid3">
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