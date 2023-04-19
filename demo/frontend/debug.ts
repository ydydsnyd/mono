import type {
  Position,
  RecordingBroadcast,
  RecordingCursor,
} from '../shared/types';
import {addCoords, must, rotatePosition, scalePosition} from '../shared/util';

const makePixel = (p: Position, s: number) => {
  let i = document.createElement('div');
  i.style.width = `${s}px`;
  i.style.height = `${s}px`;
  i.style.position = 'absolute';
  i.style.backgroundColor = 'red';
  i.style.left = p.x - s / 2 + 'px';
  i.style.top = p.y - s / 2 + 'px';
  document.getElementById('demo')!.appendChild(i);
  return i;
};

export const tracer = (p: Position, s: number = 10) => {
  const i = makePixel(p, s);
  setTimeout(() => i.parentElement!.removeChild(i), 1000);
};

export const visualizeRecording = (
  recording: RecordingBroadcast,
  frames: RecordingCursor[],
) => {
  const scale = must(recording.scale);
  const target = must(recording.targetCoord);
  const angle = must(recording.angle);
  for (const frame of frames) {
    const newPos = rotatePosition(
      addCoords(target, scalePosition(frame, {width: scale, height: scale})),
      target,
      angle,
    );
    makePixel(newPos, 4);
  }
};
