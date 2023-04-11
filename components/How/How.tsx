import React, {useState, useEffect} from 'react';
import {init} from '@/demo/howto-frontend';
import type {Reflect} from '@rocicorp/reflect';

import {nanoid} from 'nanoid';
import {delayWebSocket} from './delayWebSocket';
import {M, deregisterClientConsole} from '@/demo/shared/mutators';
import Demo1 from './Demo1';
import Demo2 from './Demo2';
import {ClientIDContext} from './ClientIDContext';
import Demo0 from './Demo0';
import {useInView} from 'react-intersection-observer';

export default function How() {
  const {ref} = useInView({
    triggerOnce: true,
    onChange: inView => {
      if (inView) {
        initHowToReflect();
      }
    },
  });

  const [iReflect1, setiReflect1] = useState<Reflect<M>>();
  const [iReflect2, setiReflect2] = useState<Reflect<M>>();
  const [iReflectServer, setiReflectServer] = useState<Reflect<M>>();

  const [rReflect1, setrReflect1] = useState<Reflect<M>>();
  const [rReflect2, setrReflect2] = useState<Reflect<M>>();
  const [rReflectServer, setrReflectServer] = useState<Reflect<M>>();

  const [iClient1ID, setiClient1ID] = useState('');
  const [iClient2ID, setiClient2ID] = useState('');

  const [rClient1ID, setrClient1ID] = useState('');
  const [rClient2ID, setrClient2ID] = useState('');

  function initIncrementDemo() {
    console.log('initIncrementDemo');
    [iReflect1, iReflect2, iReflectServer].forEach(reflect => {
      reflect?.clientID.then(deregisterClientConsole);
      reflect?.close();
    });

    const [iRoomID, iClient1UserID, iClient2UserID, iClient3UserID] = [
      'increment' + nanoid(),
      'iClient1UserID' + nanoid(),
      'iClient2UserID' + nanoid(),
      'iClient3UserID' + nanoid(),
    ];

    const ir1 = init(iRoomID, iClient1UserID);
    const ir2 = init(iRoomID, iClient2UserID);
    const ir3 = init(iRoomID, iClient3UserID);
    setiReflect1(ir1);
    setiReflect2(ir2);
    setiReflectServer(ir3);

    ir1.clientID.then(id => setiClient1ID(id));
    ir2.clientID.then(id => setiClient2ID(id));
  }

  async function initRotateDemo() {
    [rReflect1, rReflect2, rReflectServer].forEach(reflect => {
      reflect?.clientID.then(deregisterClientConsole);
      reflect?.close();
    });
    const [rRoomID, rClient1UserID, rClient2UserID, rClient3UserID] = [
      'rotate' + nanoid(),
      'rClient1UserID' + nanoid(),
      'rClient2UserID' + nanoid(),
      'rClient3UserID' + nanoid(),
    ];
    const rr1 = init(rRoomID, rClient1UserID);
    const rr2 = init(rRoomID, rClient2UserID);
    const rr3 = init(rRoomID, rClient3UserID);

    setrReflect1(rr1);
    setrReflect2(rr2);
    setrReflectServer(rr3);

    rr1.clientID.then(id => setrClient1ID(id));
    rr2.clientID.then(id => setrClient2ID(id));
  }

  function initHowToReflect() {
    delayWebSocket(process.env.NEXT_PUBLIC_WORKER_HOST!.replace(/^ws/, 'http'));
    initIncrementDemo();
    initRotateDemo();
  }

  useEffect(() => {
    return () => {
      console.log("Closing iReflect's");
      [
        iReflect1,
        iReflect2,
        iReflectServer,
        rReflect1,
        rReflect2,
        rReflectServer,
      ].forEach(reflect => {
        reflect?.clientID.then(deregisterClientConsole);
        reflect?.close();
      });
    };
  }, []);

  return (
    <div ref={ref}>
      <Demo0 />
      {iReflect1 && iReflect2 && iReflectServer && iClient1ID && iClient2ID ? (
        <ClientIDContext.Provider
          value={{client1ID: iClient1ID, client2ID: iClient2ID}}
        >
          <Demo1
            reflect1={iReflect1}
            reflect2={iReflect2}
            reflectServer={iReflectServer}
            reset={() => initIncrementDemo()}
          />
        </ClientIDContext.Provider>
      ) : null}

      {rReflect1 && rReflect2 && rReflectServer && rClient1ID && rClient2ID ? (
        <ClientIDContext.Provider
          value={{client1ID: rClient1ID, client2ID: rClient2ID}}
        >
          <Demo2
            reflect1={rReflect1}
            reflect2={rReflect2}
            reflectServer={rReflectServer}
            reset={() => initRotateDemo()}
          />
        </ClientIDContext.Provider>
      ) : null}
    </div>
  );
}
