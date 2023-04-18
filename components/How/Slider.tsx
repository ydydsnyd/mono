import * as React from 'react';
import {Range, getTrackBackground} from 'react-range';
import style from './Slider.module.css';
import {setLatency} from './delayWebSocket';

const STEP = 1;
const MIN = 0;
const MAX = 2;

type Latency = 0 | 1 | 2;

function getLatencyName(latency: Latency): string {
  return ['low', 'medium', 'high'][latency];
}

const Slider = ({clientID}: {clientID: string}) => {
  const [value, setValue] = React.useState<Latency>(0);
  const latencyName = getLatencyName(value);
  return (
    <div
      className={style.latencySlider}
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <output className={style.latencyValue} id="output">
        <span className={style.latencyLabel}>Latency: </span>
        <span className={style.latencyName}>{latencyName}</span>
      </output>
      <Range
        values={[value]}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={values => {
          setValue(values[0] as Latency);
          // If the latency is higher than 1000ms we end up hitting the ping timeout.
          const latencyMapping = [0, 300, 950];
          setLatency(clientID, latencyMapping[values[0]]);
        }}
        renderTrack={({props, children}) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '4px',
                width: '100%',
                borderRadius: '2px',
                background: getTrackBackground({
                  values: [value],
                  colors: ['#0A7AFF', '#D1D1D1'],
                  min: MIN,
                  max: MAX,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({props}) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '0.875rem',
              width: '0.875rem',
              borderRadius: '50%',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow:
                '0px 0.5px 4px 0px rgba(0,0,0,0.12), 0px 6px 13px 0px rgba(0,0,0,0.12)',
            }}
          ></div>
        )}
      />
    </div>
  );
};

export default Slider;
