import type {M} from '@/demo/shared/mutators';
import type {Reflect} from '@rocicorp/reflect';
import React from 'react';
import {Demo1} from './Demo1';

export function How({reflect}: {reflect: Reflect<M>}) {
  return <Demo1 reflect={reflect} />;
}
