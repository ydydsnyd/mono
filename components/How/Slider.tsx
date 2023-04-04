import * as React from 'react';
import {Range, getTrackBackground} from 'react-range';
import {setLatency} from './delayWebSocket';
import style from './Slider.module.css';

const STEP = 30;
const MIN = 4;
const MAX = 1000;

const Slider = ({clientID}: {clientID: string}) => {
  const [values, setValues] = React.useState([4]);
  function getLatencyPosition() {
    var pos = values[0];
    if (pos < 1000) {
      return pos.toFixed(0) + 'ms';
    } else {
      var adjustedPos = pos / 1000;
      return adjustedPos.toFixed(1) + 's';
    }
  }
  const latencyPosition = getLatencyPosition();
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
        <span className={style.latencyValueNumber}>{latencyPosition}</span>
      </output>
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={values => {
          setValues(values);
          setLatency(clientID, values[0]);
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
                  values,
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
