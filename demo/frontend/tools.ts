import {Tool} from '../shared/types';

export const TOOLS = [Tool.PAINT, Tool.MOVE, Tool.SCALE, Tool.ROTATE];

export const toolMap = <T>(map: (tool: Tool) => T) => {
  return TOOLS.reduce((r, t) => {
    r[t] = map(t);
    return r;
  }, {} as Record<Tool, T>);
};

export const initTools = (
  buttons: Record<Tool, HTMLButtonElement>,
  currentTool: () => Tool,
  switchToTool: (tool: Tool) => void,
) => {
  const updateButtons = (selectedTool: Tool) => {
    TOOLS.forEach(tool => {
      buttons[tool].disabled = selectedTool === tool;
    });
  };
  TOOLS.forEach(tool => {
    const toolPressed = () => {
      if (currentTool() !== tool) {
        switchToTool(tool);
      }
      updateButtons(tool);
    };
    buttons[tool].addEventListener('mousedown', toolPressed);
    buttons[tool].addEventListener('touchend', toolPressed);
  });
  updateButtons(currentTool());
};
