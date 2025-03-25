import { MoveHub } from '../moveHub';
import { IMoveHubPanelWithThemeProps } from './MoveHubPanel';
import arrowUpSVG from '../../../style/arrow-up.svg';
import arrowDownSVG from '../../../style/arrow-down.svg';
import turnRightSVG from '../../../style/turn-right.svg';
import turnLeftSVG from '../../../style/turn-left.svg';
import emptyLightSVG from '../../../style/emptyLight.svg';
import emptyDarkSVG from '../../../style/emptyDark.svg';
import stopSVG from '../../../style/stop.svg';
const emptyLightSVGUrl = `data:image/svg+xml;base64,${btoa(emptyLightSVG)}`;
const emptyDarkSVGUrl = `data:image/svg+xml;base64,${btoa(emptyDarkSVG)}`;
const stopSVGUrl = `data:image/svg+xml;base64,${btoa(stopSVG)}`;
const arrowUpSVGUrl = `data:image/svg+xml;base64,${btoa(arrowUpSVG)}`;
const arrowDownSVGUrl = `data:image/svg+xml;base64,${btoa(arrowDownSVG)}`;
const turnLeftSVGUrl = `data:image/svg+xml;base64,${btoa(turnLeftSVG)}`;
const turnRightSVGUrl = `data:image/svg+xml;base64,${btoa(turnRightSVG)}`;
import { UseSignal } from '@jupyterlab/apputils';

export interface IMoveHubControlProps {
  device: MoveHub;
}

export function ManualControl({ device, themeManager }: IMoveHubPanelWithThemeProps) {
  const theme = themeManager.theme;
  if (theme) {
    const isThemeLight = themeManager.isLight(theme!);
    const currentEmptySVGUrl = isThemeLight ? emptyLightSVGUrl : emptyDarkSVGUrl;
    const images = [
      {
        id: 1,
        src: currentEmptySVGUrl,
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
          await device.hub.driveToDirection(1);
        }
      },
      {
        id: 3,
        src: currentEmptySVGUrl,
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
          await device.hub.turn(-90);
        }
      },
      {
        id: 5,
        src: stopSVGUrl,
        alt: 'Image 5',
        handleClick: async () => {
          device.stop();
        }
      },
      {
        id: 6,
        src: turnRightSVGUrl,
        alt: 'Image 6',
        handleClick: async () => {
          device.hub.turn(90);
        }
      },
      {
        id: 7,
        src: currentEmptySVGUrl,
        alt: 'Image 7',
        handleClick: () => {
          console.error('Inactive button, no control available.');
        }
      },
      {
        id: 8,
        src: arrowDownSVGUrl,
        alt: 'Image 8',
        handleClick: async () => await device.hub.driveToDirection(0)
      },
      {
        id: 9,
        src: currentEmptySVGUrl,
        alt: 'Image 9',
        handleClick: () => {
          console.error('Inactive button, no control available.');
        }
      }
    ];

    return (<UseSignal signal={themeManager.themeChanged}>
      {(): JSX.Element => (
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
      )}
    </UseSignal>
    );

  }
  else {
    const images = [
      {
        id: 1,
        src: emptyLightSVGUrl,
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
          await device.hub.driveToDirection(1);
        }
      },
      {
        id: 3,
        src: emptyLightSVGUrl,
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
          await device.hub.turn(-90);
        }
      },
      {
        id: 5,
        src: stopSVGUrl,
        alt: 'Image 5',
        handleClick: async () => {
          device.stop();
        }
      },
      {
        id: 6,
        src: turnRightSVGUrl,
        alt: 'Image 6',
        handleClick: async () => {
          device.hub.turn(90);
        }
      },
      {
        id: 7,
        src: emptyLightSVGUrl,
        alt: 'Image 7',
        handleClick: () => {
          console.error('Inactive button, no control available.');
        }
      },
      {
        id: 8,
        src: arrowDownSVGUrl,
        alt: 'Image 8',
        handleClick: async () => await device.hub.driveToDirection(0)
      },
      {
        id: 9,
        src: emptyLightSVGUrl,
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
    )
  }
}


