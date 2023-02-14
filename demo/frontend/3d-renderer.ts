import {
  Scene,
  Vector3,
  SceneLoader,
  Engine,
  WebGPUEngine,
  DynamicTexture,
  Texture,
  Color3,
  Color4,
  PBRMaterial,
  CubeTexture,
  Mesh,
  HighlightLayer,
  UniversalCamera,
} from '@babylonjs/core';
import '@babylonjs/gui';
import '@babylonjs/loaders/glTF';
import type {Color, Letter, Position} from '../shared/types';
import {letterMap} from '../shared/util';
import {MAX_SCALE} from '../shared/constants';
import {LETTERS} from '../shared/letters';

const modelURL = '/alive.glb';

export type LetterInfo = {
  x?: number;
  y?: number;
  letter?: Letter;
};

const LETTER_OFFSET = 20;
// The right way to do this would be to project the pixel value of the mouse
// through the projection matrix and determine the correct world position based
// on translating it into the world coords. However, this is close and simpler,
// so will work for now.
const POSITION_FACTOR = 0.0038;

export const renderer = async (
  canvas: HTMLCanvasElement,
  textureCanvases: Record<Letter, HTMLCanvasElement>,
) => {
  // Create an engine
  let engine: Engine;
  const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
  if (webGPUSupported) {
    const webgpu = (engine = new WebGPUEngine(canvas, {
      adaptToDeviceRatio: true,
      antialiasing: true,
      stencil: true,
    }));
    await webgpu.initAsync();
    engine = webgpu;
  } else {
    engine = new Engine(canvas, true, {stencil: true}, false);
  }
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio / MAX_SCALE);
  // Create the scene
  const {
    scene,
    getTexturePosition,
    setRotation,
    setPosition,
    setScale,
    updateTexture,
    setGlowing,
    resizeCanvas,
  } = await createScene(engine, textureCanvases);
  return {
    render: () => {
      scene.render();
    },
    resizeCanvas,
    getTexturePosition,
    setRotation,
    setPosition,
    setScale,
    updateTexture,
    setGlowing,
  };
};

export const createScene = async (
  engine: Engine,
  textureCanvases: Record<Letter, HTMLCanvasElement>,
): Promise<{
  scene: Scene;
  getTexturePosition: (
    point: Position,
  ) => [Letter | undefined, Position | undefined];
  setRotation: (letter: Letter, beta: number) => void;
  setPosition: (letter: Letter, position: Position) => void;
  setScale: (letter: Letter, scale: number) => void;
  updateTexture: (letter: Letter) => void;
  setGlowing: (letter: Letter, glow: boolean, color?: Color) => void;
  resizeCanvas: () => void;
}> => {
  const scene = new Scene(engine);
  // await import('@babylonjs/core/Debug/debugLayer');
  // await import('@babylonjs/inspector');
  // scene.debugLayer.show({
  //   enablePopup: true,
  // });
  // Don't allow babylon to handle mouse events. This both has a mild perf
  // improvement and allows events to propagate to the cursor handling code.
  scene.detachControl();
  let sceneSize = engine.getRenderingCanvasClientRect()!;

  const resizeCanvas = () => {
    engine.resize();
    sceneSize = engine.getRenderingCanvasClientRect()!;
  };

  // Create our camera
  const camera = new UniversalCamera(`Camera`, new Vector3(0, 0, 0), scene);
  camera.freezeProjectionMatrix(camera.getProjectionMatrix());
  camera.fov = 0.5;

  // Load the model
  await SceneLoader.ImportMeshAsync(LETTERS, modelURL, undefined, scene);
  const meshes = letterMap(letter => {
    const mesh = scene.getMeshByName(letter) as Mesh;
    return mesh;
  });

  // Create a texture from our canvas
  const textures = letterMap(
    letter =>
      new DynamicTexture(
        letter,
        textureCanvases[letter],
        scene,
        false,
        Texture.BILINEAR_SAMPLINGMODE,
      ),
  );

  const updateTexture = (letter: Letter) =>
    textures[letter].update(true, true, true);

  const setRotation = (letter: Letter, beta: number) => {
    console.log('------');
    console.log(letter, 'rotation', meshes[letter].rotation);
    const rotation = beta * (Math.PI / 180);
    meshes[letter].rotation = new Vector3(
      90 * (Math.PI / 180),
      -rotation,
      180 * (Math.PI / 180),
    );
    console.log(letter, 'rotation', meshes[letter].rotation);
  };
  const setPosition = (letter: Letter, position: Position) => {
    // const {width: scaleX, height: scaleY} =
    //   engine.getRenderingCanvasClientRect()!;
    console.log('------');
    console.log(letter, 'position', meshes[letter].position);
    const viewport = camera.viewport.toGlobal(
      engine.getRenderWidth(),
      engine.getRenderHeight(),
    );
    meshes[letter].position = new Vector3(
      -position.x * viewport.width * POSITION_FACTOR,
      -position.y * viewport.height * POSITION_FACTOR,
      LETTER_OFFSET,
    );
    console.log(letter, 'position', meshes[letter].position);
  };
  const scaleFactor = 1;
  const setScale = (letter: Letter, scale: number) => {
    console.log('------');
    console.log(letter, 'scale', meshes[letter].scaling);
    meshes[letter].scaling = new Vector3(
      scale * scaleFactor,
      scale * scaleFactor,
      scale * scaleFactor,
    );
    console.log(letter, 'scale', meshes[letter].scaling);
  };
  LETTERS.forEach(letter => {
    setRotation(letter, 0);
    setPosition(letter, {x: 0, y: 0});
    setScale(letter, 1);
  });

  const highlights = letterMap(letter => {
    const hl = new HighlightLayer(`${letter}-glow`, scene);
    hl.blurHorizontalSize = 2;
    hl.blurVerticalSize = 2;
    return hl;
  });

  const setGlowing = (letter: Letter, glow: boolean, color?: Color) => {
    if (glow) {
      highlights[letter].addMesh(
        meshes[letter],
        new Color3(...color!.map(c => c / 255)),
      );
    } else {
      highlights[letter].removeAllMeshes();
    }
  };

  // Add the textures to the meshes
  LETTERS.forEach(letter => {
    const material = new PBRMaterial(`${letter}-material`, scene);

    material.metallic = 0.0;
    material.roughness = 1.0;

    material.clearCoat.isEnabled = true;
    material.clearCoat.intensity = 0.9;
    material.clearCoat.roughness = 0.3;
    material.clearCoat.indexOfRefraction = 2.8;

    material.iridescence.isEnabled = true;
    material.albedoColor = new Color3(0, 0, 0);
    material.lightmapTexture = textures[letter];
    material.enableSpecularAntiAliasing = true;

    meshes[letter].material = material;
    return material;
  });

  const environmentTexture = CubeTexture.CreateFromPrefilteredData(
    '/img/environment.env',
    scene,
  );
  environmentTexture.name = 'env';
  environmentTexture.gammaSpace = false;
  environmentTexture.rotationY = Math.PI / 2.2;
  scene.environmentTexture = environmentTexture;

  // Make clear totally transparent - by default it'll be some scene background color.
  scene.clearColor = new Color4(0, 0, 0, 0);

  // Expose a method for finding the letter and position of an arbitrary point.
  const getTexturePosition = (
    cursor: Position,
  ): [Letter | undefined, Position | undefined] => {
    const pickInfo = scene.pick(cursor.x, cursor.y);
    const {x, y} = pickInfo.getTextureCoordinates() || {x: -1, y: -1};
    const letter = pickInfo.pickedMesh?.name as Letter | undefined;
    // if (pickInfo.hit) {
    //   console.log(scenePos, letter);
    // } else {
    //   console.log('Miss');
    // }
    if (letter && LETTERS.includes(letter)) {
      return [
        letter,
        {
          x,
          y: 1 - y, // Y is inverted in the 3D space
        },
      ];
    }
    return [letter, undefined];
  };

  return {
    scene,
    getTexturePosition,
    setRotation,
    setScale,
    setPosition,
    updateTexture,
    setGlowing,
    resizeCanvas,
  };
};
