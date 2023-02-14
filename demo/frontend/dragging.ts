import {Letter, Position, Rotation, Tool} from '../shared/types';

export enum Control {
  None = 'not-control',
  Scale = 'scale',
  Rotate = 'rotate',
}

const CONTROLS = [Control.Scale, Control.Rotate];

export const ControlTools = {
  [Control.None]: Tool.MOVE,
  [Control.Scale]: Tool.SCALE,
  [Control.Rotate]: Tool.ROTATE,
};

type Drag = {
  letter: Letter | undefined;
  scale: number;
  rotation: Rotation;
  position: Position;
  start: Position;
  control: Control;
};

export const addDragHandlers = (
  container: HTMLElement,
  getScales: () => Record<Letter, number>,
  getRotations: () => Record<Letter, Rotation>,
  getPositions: () => Record<Letter, Position>,
  getLetter: (position: Position) => Letter | undefined,
  onChange: (letter: Letter) => void,
) => {
  let drag: Drag | undefined = undefined;

  const beginDrag = (
    mousePos: Position,
    controlInfo: {control: Control; element?: HTMLElement},
  ) => {
    const {element, control} = controlInfo;
    if (element) {
      element.classList.add('show');
    }
    const letter = getLetter(mousePos) as Letter;
    drag = {
      control,
      scale: getScales()[letter],
      rotation: getRotations()[letter],
      position: getPositions()[letter],
      start: {
        x: mousePos.x,
        y: mousePos.y,
      },
      letter,
    };
    if (letter) {
      onChange(letter);
    }
    window.addEventListener('mouseup', releaseDrag);
    window.addEventListener('touchend', releaseDrag);
    window.addEventListener('mouseleave', releaseDrag);
  };

  const releaseDrag = () => {
    const lastLetter = drag?.letter;
    drag = undefined;
    if (lastLetter) {
      onChange(lastLetter);
    }
    document.querySelectorAll('.controls.show').forEach(e => {
      e.classList.remove('show');
    });
    window.removeEventListener('mouseup', releaseDrag);
    window.removeEventListener('touchend', releaseDrag);
    window.removeEventListener('mouseleave', releaseDrag);
  };

  const mousedownHandler = (e: MouseEvent) => {
    beginDrag(
      {
        x: e.clientX,
        y: e.clientY,
      },
      getControl(e.target),
    );
  };
  container.addEventListener('mousedown', mousedownHandler);
  // document.querySelectorAll(`#${letter} .controls button`)?.forEach(b => {
  //   (b as HTMLButtonElement).addEventListener('mousedown', mousedownHandler);
  // });
  const touchHandler = (e: TouchEvent) => {
    const lt = e.touches[e.touches.length - 1];
    beginDrag(
      {
        x: lt.clientX,
        y: lt.clientY,
      },
      {control: Control.None},
    );
  };
  container.addEventListener('touchstart', touchHandler);
  // document.querySelectorAll(`#${letter} .controls button`)?.forEach(b => {
  //   (b as HTMLButtonElement).addEventListener('touchstart', touchHandler);
  // });

  return () => drag;
};

const isElement = (e: EventTarget | null): e is HTMLElement =>
  !!(e && (e as HTMLElement))?.classList;

const getControl = (
  e: EventTarget | null,
): {control: Control; element?: HTMLElement} => {
  if (!isElement(e)) {
    return {control: Control.None};
  }
  const parent = e.parentElement;
  // If we reach the controls div, don't continue to traverse up
  if (e.classList.contains('controls') || !parent) {
    return {control: Control.None};
  }
  let control = Control.None;
  for (const c of CONTROLS) {
    if (e.classList.contains(c)) {
      control = c;
      break;
    }
  }
  if (parent.classList.contains('controls')) {
    return {control, element: parent};
  }
  return getControl(e.parentElement);
};
