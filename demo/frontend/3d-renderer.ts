import {
  Scene,
  Vector3,
  SceneLoader,
  Engine,
  EngineView,
  WebGPUEngine,
  DynamicTexture,
  Texture,
  Color3,
  Color4,
  UniversalCamera,
  PBRMaterial,
  CubeTexture,
  Mesh,
  HighlightLayer,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import {Color, Letter, Position} from '../shared/types';
import {asyncLetterMap} from '../shared/util';
import {MAX_SCALE} from '../shared/constants';

const modelURL = '/alive.glb';

export type LetterInfo = {
  x?: number;
  y?: number;
  letter?: Letter;
};

export const renderer = async (
  renderCanvas: HTMLCanvasElement,
  canvases: Record<Letter, HTMLCanvasElement>,
  textureCanvases: Record<Letter, HTMLCanvasElement>,
) => {
  // Create an engine
  let engine: Engine;
  const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
  if (webGPUSupported) {
    const webgpu = (engine = new WebGPUEngine(renderCanvas, {
      adaptToDeviceRatio: true,
      antialiasing: true,
      stencil: true,
    }));
    await webgpu.initAsync();
    engine = webgpu;
  } else {
    engine = new Engine(renderCanvas, true, {stencil: true}, false);
  }
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio / MAX_SCALE);
  // Create the scenes
  const scenesByViewId: Record<string, Scene> = {};
  const scenes = await asyncLetterMap(async letter => {
    const [
      scene,
      view,
      getTexturePosition,
      setRotation,
      updateTexture,
      setGlowing,
    ] = await createScene(
      engine,
      letter,
      canvases[letter],
      textureCanvases[letter],
    );
    scenesByViewId[view.id] = scene;
    return {
      render: () => scene.render(),
      getTexturePosition,
      setRotation,
      updateTexture,
      setGlowing,
    };
  });
  return {
    startRendering: () => {
      engine.runRenderLoop(() => {
        if (engine.activeView?.id) {
          const scene = scenesByViewId[engine.activeView?.id];
          scene?.render();
        }
      });
    },
    resize3DCanvas: (_: Letter) => {
      engine.resize();
    },
    getTexturePosition: (letter: Letter, point: Position) => {
      return scenes[letter].getTexturePosition(point);
    },
    set3DRotation: (letter: Letter, beta: number) => {
      scenes[letter].setRotation(beta);
    },
    update3DTexture: (letter: Letter) => {
      scenes[letter].updateTexture();
    },
    setGlowing: (letter: Letter, glow: boolean, color?: Color) => {
      scenes[letter].setGlowing(glow, color);
    },
  };
};

// Extremely magic - these are just manually adjusted to make them look right.
const LETTER_CAMERA_POSITIONS: Record<Letter, Vector3> = {
  [Letter.A]: new Vector3(-2.1, 0.1, -43.5),
  [Letter.L]: new Vector3(-4.8, 0.05, -57),
  [Letter.I]: new Vector3(-6.74, 0, -59),
  [Letter.V]: new Vector3(-9.7, -0.14, -42),
  [Letter.E]: new Vector3(-13.65, -0, -44),
};

export const createScene = async (
  engine: Engine,
  letter: Letter,
  canvas: HTMLCanvasElement,
  textureCanvas: HTMLCanvasElement,
): Promise<
  [
    Scene,
    EngineView,
    (point: Position) => Position | undefined,
    (beta: number) => void,
    () => void,
    (glow: boolean, color?: Color) => void,
  ]
> => {
  const scene = new Scene(engine);
  // Don't allow babylon to handle mouse events. This both has a mild perf
  // improvement and allows events to propagate to the cursor handling code.
  scene.detachControl();

  // Create our camera. It's in a fixed position with a very wide field of view to
  // create the illusion of flat letters to begin with.
  const camera = new UniversalCamera(
    `Camera ${letter}`,
    LETTER_CAMERA_POSITIONS[letter],
    scene,
  );
  camera.fov = 0.1;
  const engineView = engine.registerView(canvas, camera, true);

  scene.activeCamera = camera;

  // Load the model
  await SceneLoader.ImportMeshAsync([letter], modelURL, undefined, scene);
  const mesh = scene.getMeshByName(letter) as Mesh;

  // Create a texture from our canvas
  const texture = new DynamicTexture(
    letter,
    textureCanvas,
    scene,
    false,
    Texture.BILINEAR_SAMPLINGMODE,
  );
  const updateTexture = () => texture.update(true, true, true);

  // Rotation updates can be either done locally or remotely. Allow external state to overwrite our local rotation
  const setRotation = (beta: number) => {
    const rotation = beta * (Math.PI / 180);
    mesh.rotation = new Vector3(Math.PI / 2, -rotation, (2 * Math.PI) / 2);
  };

  const hl = new HighlightLayer(`${letter}-glow`, scene);
  hl.blurHorizontalSize = 2;
  hl.blurVerticalSize = 2;

  const setGlowing = (glow: boolean, color?: Color) => {
    if (glow) {
      hl.addMesh(mesh, new Color3(...color!.map(c => c / 255)));
    } else {
      hl.removeAllMeshes();
    }
  };

  // Add the texture to the mesh
  const material = new PBRMaterial(`${letter}-material`, scene);

  material.metallic = 0.0;
  material.roughness = 1.0;

  material.clearCoat.isEnabled = true;
  material.clearCoat.intensity = 0.9;
  material.clearCoat.roughness = 0.3;
  material.clearCoat.indexOfRefraction = 2.8;

  material.iridescence.isEnabled = true;
  material.albedoColor = new Color3(0, 0, 0);
  material.lightmapTexture = texture;
  material.enableSpecularAntiAliasing = true;

  mesh.material = material;

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
  const getTexturePosition = (cursor: Position): Position | undefined => {
    const pickInfo = scene.pick(cursor.x, cursor.y);
    const {x, y} = pickInfo.getTextureCoordinates() || {x: -1, y: -1};
    const mesh = pickInfo.pickedMesh?.name;
    if (mesh === letter) {
      return {
        x,
        y: 1 - y, // Y is inverted in the 3D space
      };
    }
    return undefined;
  };

  return [
    scene,
    engineView,
    getTexturePosition,
    setRotation,
    updateTexture,
    setGlowing,
  ];
};
