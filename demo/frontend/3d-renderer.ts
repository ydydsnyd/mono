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
  ArcRotateCamera,
  Camera,
  MeshBuilder,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import type {
  Color,
  Letter,
  Position,
  Quaternion,
  Vector,
} from '../shared/types';
import {letterMap} from '../shared/util';
import {LETTERS, LETTER_POSITIONS, LETTER_OFFSET} from '../shared/letters';
import type {DebugRenderBuffers} from '@dimforge/rapier3d';

const modelURL = '/alive.glb';

export type LetterInfo = {
  x?: number;
  y?: number;
  letter?: Letter;
};

const ORTHO_SIZE_FACTOR = 0.03;
const ORTHO_VERTICAL_POS = 0.128;

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
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
  // Create the scene
  const {
    scene,
    getTexturePosition,
    setRotation,
    setPosition,
    setQuaternion,
    setScale,
    updateTexture,
    setGlowing,
    resizeCanvas,
    updateDebug,
  } = await createScene(engine, textureCanvases);
  return {
    render: () => {
      scene.render();
    },
    resizeCanvas,
    getTexturePosition,
    setRotation,
    setPosition,
    setQuaternion,
    setScale,
    updateTexture,
    setGlowing,
    updateDebug,
  };
};

export const createScene = async (
  engine: Engine,
  textureCanvases: Record<Letter, HTMLCanvasElement>,
): Promise<{
  scene: Scene;
  getTexturePosition: (
    point: Position,
  ) => [Letter | undefined, Position | undefined, Vector | undefined];
  setRotation: (letter: Letter, beta: number) => void;
  setPosition: (letter: Letter, position: Position) => void;
  setQuaternion: (letter: Letter, quaternion: Quaternion) => void;
  setScale: (letter: Letter, scale: number) => void;
  updateTexture: (letter: Letter) => void;
  setGlowing: (letter: Letter, glow: boolean, color?: Color) => void;
  resizeCanvas: () => void;
  updateDebug: (debug: DebugRenderBuffers | null) => void;
}> => {
  const scene = new Scene(engine);
  // Don't allow babylon to handle mouse events. This both has a mild perf
  // improvement and allows events to propagate to the cursor handling code.
  scene.detachControl();

  const sceneScaleFactor = () => {
    const canvasSize = engine.getRenderingCanvasClientRect()!;
    const width = canvasSize.width * ORTHO_SIZE_FACTOR;
    const height = canvasSize.height * ORTHO_SIZE_FACTOR;
    return {width, height};
  };

  const resizeCanvas = () => {
    const {width, height} = sceneScaleFactor();
    camera.orthoLeft = -(width / 2);
    camera.orthoRight = width / 2;
    camera.orthoTop = height * ORTHO_VERTICAL_POS;
    camera.orthoBottom = -height * (1 - ORTHO_VERTICAL_POS);
    engine.resize();
  };

  // Create our camera
  const camera = new ArcRotateCamera(
    'Camera',
    270 * (Math.PI / 180),
    90 * (Math.PI / 180),
    5,
    new Vector3(0, 0, 0),
    scene,
    true,
  );
  camera.setTarget(Vector3.Zero());
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  camera.minZ = -10;

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
    const rotation = beta * (Math.PI / 180);
    meshes[letter].rotation = new Vector3(
      90 * (Math.PI / 180),
      rotation,
      180 * (Math.PI / 180),
    );
  };
  const setPosition = (letter: Letter, position: Position) => {
    const {width: scaleX, height: scaleY} = sceneScaleFactor();
    const origin = LETTER_POSITIONS[letter];
    meshes[letter].position = new Vector3(
      // TODO: x value is reversed in babylon for some reason
      -origin.x - position.x * scaleX,
      origin.y - position.y * scaleY,
      LETTER_OFFSET,
    );
  };
  const setScale = (letter: Letter, scale: number) => {
    meshes[letter].scaling = new Vector3(scale, scale, scale);
  };
  const setQuaternion = (letter: Letter, quaternion: Quaternion) => {
    meshes[letter].rotationQuaternion?.set(
      quaternion.x,
      quaternion.y,
      quaternion.z,
      quaternion.w,
    );
  };
  LETTERS.forEach(letter => {
    setRotation(letter, 0);
    setPosition(letter, {x: 0, y: 0});
    setScale(letter, 1);
  });

  const highlights = letterMap(letter => {
    const hl = new HighlightLayer(`${letter}-glow`, scene);
    hl.blurHorizontalSize = 1;
    hl.blurVerticalSize = 1;
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
  setInterval(() => {
    environmentTexture.rotationY += 0.01;
  }, 30);

  // Make clear totally transparent - by default it'll be some scene background color.
  scene.clearColor = new Color4(0, 0, 0, 0);

  const letterMeshNames = new Set(LETTERS);
  // Expose a method for finding the letter and position of an arbitrary point.
  const getTexturePosition = (
    cursor: Position,
  ): [Letter | undefined, Position | undefined, Vector | undefined] => {
    const pickInfo = scene.pick(cursor.x, cursor.y, mesh =>
      letterMeshNames.has(mesh.name as Letter),
    );
    const {x, y} = pickInfo.getTextureCoordinates() || {x: -1, y: -1};
    const letter = pickInfo.pickedMesh?.name as Letter | undefined;
    if (letter) {
      return [
        letter,
        {
          x,
          y: 1 - y, // Y is inverted in the 3D space
        },
        pickInfo.pickedPoint!,
      ];
    }
    return [undefined, undefined, undefined];
  };

  let lines = MeshBuilder.CreateLines(
    'debug-lines',
    {
      points: [],
      updatable: true,
    },
    scene,
  );
  const updateDebug = (debug: DebugRenderBuffers | null) => {
    if (!debug) {
      lines.dispose();
      return;
    }
    const points: Vector3[] = [];
    let buf = new Vector3();
    debug.vertices.forEach((v, idx) => {
      const lIdx = idx % 3;
      if (lIdx === 0) {
        buf.x = v;
      } else if (lIdx === 1) {
        buf.y = v;
      } else if (lIdx === 2) {
        buf.z = v;
        points.push(buf);
        buf = new Vector3();
      }
    });
    const colors: Color4[] = [];
    let cbuf = new Color4();
    debug.colors.forEach((v, idx) => {
      const lIdx = idx % 4;
      if (lIdx === 0) {
        cbuf.r = v;
      } else if (lIdx === 1) {
        cbuf.g = v;
      } else if (lIdx === 2) {
        cbuf.b = v;
      } else if (lIdx === 3) {
        cbuf.a = v;
        colors.push(cbuf);
        cbuf = new Color4();
      }
    });
    lines.dispose();
    lines = MeshBuilder.CreateLines(
      'debug-lines',
      {
        points,
        updatable: true,
        colors,
      },
      scene,
    );
  };

  return {
    scene,
    getTexturePosition,
    setRotation,
    setScale,
    setPosition,
    setQuaternion,
    updateTexture,
    setGlowing,
    resizeCanvas,
    updateDebug,
  };
};
