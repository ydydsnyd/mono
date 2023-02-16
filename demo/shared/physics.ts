import type rapier3dlib from '@dimforge/rapier3d';
import type {World} from '@dimforge/rapier3d';
import type {
  Letter,
  Physics,
  Vector,
  LetterHandles,
  Impulse,
  Letter3DPosition,
} from './types';
import {letterMap} from './util';
import * as hulls from './hulls';
import {decode} from './uint82b64';
import {LETTERS, LETTER_OFFSET, LETTER_POSITIONS} from './letters';

const VectorZero: Vector = {x: 0, y: 0, z: 0};

export type Rapier3D = typeof rapier3dlib;

export const getPhysics = (
  engine: Rapier3D,
  origin: Physics | undefined,
  impulses: Record<Letter, Impulse[]>,
  step: number,
): [Record<Letter, Letter3DPosition | null>, World, LetterHandles] => {
  // Physics are computed based on the step number and the origin.
  let world: World;
  let handles: LetterHandles;
  if (!origin || origin.step === -1) {
    // default origin
    [world, handles] = setupWorld(engine);
  } else {
    [world, handles] = parseWorld(engine, origin);
  }
  const originStep = origin ? origin.step : 0;
  const positions = runPhysics(
    engine,
    world,
    handles,
    originStep,
    step,
    impulses,
  );
  return [positions, world, handles];
};

const setupWorld = ({
  World,
  RigidBodyDesc,
  ColliderDesc,
  JointData,
}: Rapier3D): [World, LetterHandles] => {
  const world = new World({x: 0.0, y: 0.0, z: 0.0});

  const handles = letterMap(letter => {
    const origin = LETTER_POSITIONS[letter];
    const letterPosition: Vector = {
      x: origin.x,
      y: origin.y,
      z: LETTER_OFFSET,
    };
    const letterBody = world.createRigidBody(RigidBodyDesc.dynamic());
    letterBody.setTranslation(letterPosition, true);
    const jointBody = world.createRigidBody(RigidBodyDesc.fixed());
    jointBody.setTranslation(letterPosition, true);
    hulls[letter].forEach(hull => {
      world.createCollider(
        ColliderDesc.convexHull(hull)!.setFriction(5).setMass(5),
        letterBody,
      );
    });
    world.createImpulseJoint(
      JointData.spherical(VectorZero, VectorZero),
      letterBody,
      jointBody,
      true,
    );
    return letterBody.handle;
  });
  return [world, handles];
};

const parseWorld = (
  {World}: Rapier3D,
  physics: Physics,
): [World, LetterHandles] => {
  let world: World;
  try {
    world = World.restoreSnapshot(decode(physics.state));
  } catch (e) {
    throw new Error(`Invalid state: ${(e as Error).message}`);
  }
  if (!world) {
    throw new Error(`Invalid state :${physics.state}`);
  }
  return [world, physics.handles];
};

export const impulseId = (i: Impulse) => `${i.u}${i.s}${i.x + i.y + i.z}`;

export type LetterImpulse = Impulse & {letter: Letter};

export const impulsesToSteps = (
  impulses: Record<Letter, Impulse[]>,
): Record<number, LetterImpulse[]> => {
  const impulseSteps: Record<number, (Impulse & {letter: Letter})[]> = {};
  LETTERS.forEach(letter => {
    impulses[letter].forEach(impulse => {
      impulseSteps[impulse.s] = impulseSteps[impulse.s] || [];
      impulseSteps[impulse.s].push({...impulse, letter});
    });
  });
  return impulseSteps;
};

const runPhysics = (
  {Vector3}: Rapier3D,
  world: World,
  handles: LetterHandles,
  from: number,
  until: number,
  impulses: Record<Letter, Impulse[]>,
) => {
  const impulseSteps = impulsesToSteps(impulses);
  for (let i = from; i < until; i++) {
    if (impulseSteps[i]) {
      impulseSteps[i].forEach(impulse => {
        const letterBody = world.bodies.get(handles[impulse.letter]);
        letterBody?.applyImpulseAtPoint(
          new Vector3(0, 0.0, 5.0),
          impulse,
          true,
        );
      });
    }
    world.step();
  }

  const letters = letterMap<Letter3DPosition | null>(letter => {
    const body = world.bodies.get(handles[letter]);
    if (!body) {
      return null;
    }
    return {
      position: body.translation(),
      rotation: body.rotation(),
    };
  });

  return letters;
};
