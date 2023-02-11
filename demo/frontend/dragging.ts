import {translateCoords} from '../shared/util';
import {LETTERS} from '../shared/letters';
import {Letter, Position, Rotation, Tool} from '../shared/types';

enum Control {
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
  scale: number;
  rotation: Rotation;
  position: Position;
  offset: Position;
  letter: Letter;
  control: Control;
};

export const addDragHandlers = (
  container: HTMLDivElement,
  letterContainers: Record<Letter, HTMLDivElement>,
  getScales: () => Record<Letter, number>,
  getSpinDegrees: (letter: Letter) => Rotation,
  onChange: (letter: Letter) => void,
) => {
  let drag: Drag | undefined = undefined;

  const beginDrag = (
    letter: Letter,
    mousePos: Position,
    controlInfo: {control: Control; element?: HTMLElement},
  ) => {
    const scales = getScales();
    const bb = letterContainers[letter].getBoundingClientRect();
    const absLetterPos = translateCoords(bb, container.getBoundingClientRect());
    const {element, control} = controlInfo;
    if (element) {
      element.classList.add('show');
    }
    drag = {
      control,
      scale: scales[letter],
      rotation: getSpinDegrees(letter),
      position: {
        x: mousePos.x,
        y: mousePos.y,
      },
      offset: {
        x: mousePos.x - absLetterPos.x,
        y: mousePos.y - absLetterPos.y,
      },
      letter,
    };
    onChange(letter);
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

  LETTERS.forEach(letter => {
    const canvas = letterContainers[letter];
    const mousedownHandler = (e: MouseEvent) => {
      beginDrag(
        letter,
        {
          x: e.clientX,
          y: e.clientY,
        },
        getControl(e.target),
      );
    };
    canvas.addEventListener('mousedown', mousedownHandler);
    document.querySelectorAll(`#${letter} .controls button`)?.forEach(b => {
      (b as HTMLButtonElement).addEventListener('mousedown', mousedownHandler);
    });
    const touchHandler = (e: TouchEvent) => {
      const lt = e.touches[e.touches.length - 1];
      beginDrag(
        letter,
        {
          x: lt.clientX,
          y: lt.clientY,
        },
        {control: Control.None},
      );
    };
    canvas.addEventListener('touchstart', touchHandler);
    document.querySelectorAll(`#${letter} .controls button`)?.forEach(b => {
      (b as HTMLButtonElement).addEventListener('touchstart', touchHandler);
    });
  });

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
