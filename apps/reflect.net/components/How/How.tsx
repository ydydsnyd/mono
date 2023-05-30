import type {M} from '@/demo/shared/mutators';
import type {Reflect} from '@rocicorp/reflect';
import React from 'react';
import {Demo1} from './Demo1';

export function How({reflect}: {reflect: Reflect<M>}) {
  return (
    <>
      <p
        style={{
          textAlign: 'center',
          fontSize: '1.3rem',
        }}
      >
        <a href="https://count.reflect.net/">count.reflect.net</a>
      </p>
      <Demo1 reflect={reflect} />
    </>
  );
}
