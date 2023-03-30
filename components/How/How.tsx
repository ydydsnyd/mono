import React, {useState, useEffect} from 'react';
import {init} from '@/demo/howto-frontend';
import type {Reflect} from '@rocicorp/reflect';

import {nanoid} from 'nanoid';
import {delayWebSocket} from './delayWebSocket';
import {M, deregisterClientConsole} from '@/demo/shared/mutators';
import Demo1 from './Demo1';
import Demo2 from './Demo2';
import {ClientIDContext} from './ClientIDContext';

export default function How() {
  const [iReflect1, setiReflect1] = useState<Reflect<M>>();
  const [iReflect2, setiReflect2] = useState<Reflect<M>>();
  const [rReflect1, setrReflect1] = useState<Reflect<M>>();
  const [rReflect2, setrReflect2] = useState<Reflect<M>>();
  const [iClient1ID, setiClient1ID] = useState('');
  const [iClient2ID, setiClient2ID] = useState('');
  const [rClient1ID, setrClient1ID] = useState('');
  const [rClient2ID, setrClient2ID] = useState('');

  function initHowToReflect() {
    delayWebSocket(process.env.NEXT_PUBLIC_WORKER_HOST!.replace(/^ws/, 'http'));
    const [iRoomID, iClient1UserID, iClient2UserID] = [
      'increment' + nanoid(),
      'iClient1UserID' + nanoid(),
      'iClient2UserID' + nanoid(),
    ];

    const [rRoomID, rClient1UserID, rClient2UserID] = [
      'rorate' + nanoid(),
      'rClient1UserID' + nanoid(),
      'rClient2UserID' + nanoid(),
    ];

    const iReflect1 = init(iRoomID, iClient1UserID);
    const iReflect2 = init(iRoomID, iClient2UserID);
    const rReflect1 = init(rRoomID, rClient1UserID);
    const rReflect2 = init(rRoomID, rClient2UserID);

    setiReflect1(iReflect1);
    setiReflect2(iReflect2);
    setrReflect1(rReflect1);
    setrReflect2(rReflect2);

    iReflect1.clientID.then(id => setiClient1ID(id));
    iReflect2.clientID.then(id => setiClient2ID(id));
    rReflect1.clientID.then(id => setrClient1ID(id));
    rReflect2.clientID.then(id => setrClient2ID(id));
  }

  useEffect(() => {
    initHowToReflect();

    return () => {
      console.log("Closing iReflect's");
      [iReflect1, iReflect2].forEach(reflect => {
        reflect?.clientID.then(deregisterClientConsole);
        reflect?.close();
      });
    };
  }, []);

  return (
    <>
      {iReflect1 && iReflect2 && iClient1ID && iClient2ID ? (
        <ClientIDContext.Provider
          value={{client1ID: iClient1ID, client2ID: iClient2ID}}
        >
          <Demo1 reflect1={iReflect1} reflect2={iReflect2} />
        </ClientIDContext.Provider>
      ) : null}

      {rReflect1 && rReflect2 && rClient1ID && rClient2ID ? (
        <ClientIDContext.Provider
          value={{client1ID: rClient1ID, client2ID: rClient2ID}}
        >
          <Demo2 reflect1={rReflect1} reflect2={rReflect2} />
        </ClientIDContext.Provider>
      ) : null}
    </>
  );
}
