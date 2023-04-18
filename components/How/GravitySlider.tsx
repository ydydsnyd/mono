import {Range, getTrackBackground} from 'react-range';
import style from './Slider.module.css';
import {useEffect, useState} from 'react';

const STEP = 0.1;
const MIN = -10;
const MAX = 10;
const DRIFT_RATE = 1; // adjust this to change the rate of drift
const INTERVAL_MS = 8;

const GravitySlider = ({increment}: {increment: (delta: number) => void}) => {
  const [values, setValues] = useState([0]);
  const [drifting, setDrifting] = useState(false);

  useEffect(() => {
    const intervalCallback = () => {
      if (drifting && values[0] !== 0) {
        const newValue =
          values[0] > 0 ? values[0] - DRIFT_RATE : values[0] + DRIFT_RATE;
        //zero clamp the newValue while its drifting
        setValues([
          (newValue > 0 && newValue < DRIFT_RATE) ||
          (newValue < 0 && newValue > -DRIFT_RATE)
            ? 0
            : newValue,
        ]);
        setDrifting(newValue !== 0);
      } else if (values[0] !== 0) {
        increment(values[0]);
      }
    };

    const intervalId = setInterval(intervalCallback, INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [drifting, values, increment]);

  const speed = `${values[0].toFixed(1)}°`;

  return (
    <div
      className={style.speedSlider}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <output className={style.speedValue} id="output">
        <span className={style.speedValueNumber}>{speed}</span>
      </output>
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={values => {
          setValues(values);
          setDrifting(false);
        }}
        onFinalChange={() => {
          setDrifting(true);
        }}
        renderTrack={({props, children}) => (
          <div
            onMouseDown={event => {
              props.onMouseDown(event);
              setDrifting(false);
            }}
            onTouchStart={event => {
              props.onTouchStart(event);
              setDrifting(false);
            }}
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
                height: '5px',
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

export default GravitySlider;
