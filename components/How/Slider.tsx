import * as React from 'react';
import {Range, getTrackBackground} from 'react-range';
import style from './Slider.module.css';
import type {Latency} from '@/demo/shared/types';

const STEP = 1;
const MIN = 0;
const MAX = 2;

function getLatencyName(latency: Latency): string {
  return ['low', 'med', 'high'][latency];
}

const Slider = ({
  clientLatency,
  setClientLatency,
}: {
  clientID: string;
  clientLatency: Latency;
  setClientLatency: (l: Latency) => void;
}) => {
  const latencyName = getLatencyName(clientLatency);
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
        values={[clientLatency]}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={values => {
          setClientLatency(values[0] as Latency);
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
                  values: [clientLatency],
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
