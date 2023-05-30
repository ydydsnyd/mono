import {hasClient, listClients} from '@/demo/alive/client-model';
import {colorToString, idToColor} from '@/demo/alive/colors';
import {CursorField} from '@/demo/alive/CursorField';
import {loggingOptions} from '@/demo/frontend/logging-options';
import {mutators, type M} from '@/demo/shared/mutators';
import {useIsomorphicLayoutEffect} from '@/hooks/use-isomorphic-layout-effect';
import styles from '@/styles/Home.module.css';
import {getLocationString, Location} from '@/util/get-location-string';
import {closeReflect} from '@/util/reflect';
import {getWorkerHost} from '@/util/worker-host';
import {ExperimentalMemKVStore, Reflect} from '@rocicorp/reflect';
import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {useSubscribe} from 'replicache-react';

function useReflect(puzzleRoomID: string | null) {
  const [r, setR] = useState<Reflect<M> | null>(null);
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    if (!puzzleRoomID) {
      return;
    }

    const reflect = new Reflect<M>({
      socketOrigin: getWorkerHost(),
      createKVStore: name => new ExperimentalMemKVStore(name),
      userID: 'anon',
      roomID: puzzleRoomID,
      mutators,
      ...loggingOptions,
    });

    reflect.onUpdateNeeded = reason => {
      if (reason.type !== 'NewClientGroup') {
        location.reload();
      }
    };

    const url = new URL(location.href);
    if (url.searchParams.has('reset')) {
      console.info('Resetting replicache');
      void reflect.mutate.resetRoom();
    }

    reflect.onOnlineChange = online => {
      setOnline(online);
    };

    const onBlur = async () => {
      void reflect.mutate.updateClient({
        id: await reflect.clientID,
        focused: false,
      });
    };
    const onFocus = async () => {
      void reflect.mutate.updateClient({
        id: await reflect.clientID,
        focused: true,
      });
    };
    //window.addEventListener('blur', onBlur);
    //window.addEventListener('focus', onFocus);

    setR(reflect);
    return () => {
      setR(null);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      closeReflect(reflect);
    };
  }, [puzzleRoomID]);

  return {r, online};
}

function useEnsureMyClient(
  r: Reflect<M> | null,
  tabIsVisible: boolean,
): string | undefined {
  const cid = useSubscribe(
    r,
    async tx => {
      const cid = tx.clientID;
      if (await hasClient(tx, cid)) {
        return cid;
      }
      return undefined;
    },
    undefined,
  );

  if (cid !== undefined) {
    return cid;
  }

  // Runs on every render :(
  // Ideally we could do this only when we come back online, but the online
  // event in Reflect is currently broken and doesn't fire. When we fix the
  // online event, there is an interesting subtlety: we have decided that
  // we will wait for two errors in a row to fire the online change, but the
  // disconnect on server happens sooner. We have to be sure that it is not
  // possible for the client to observe a situation where the disconnect
  // handler has run server-side and had some effect that the client sees,
  // before the online change event happens. Otherwise you cannot use this
  // nice pattern of creating client-specific state in the online change
  // handler and deleting in the server-side disconnect handler.
  if (r === null) {
    return undefined;
  }

  // Do not re-create the client if tab not visible.
  if (!tabIsVisible) {
    return undefined;
  }

  const ensure = async () => {
    const cid = await r.clientID;
    await r.mutate.ensureClient({
      id: cid,
      selectedPieceID: '',
      // off the page, so not visible till user moves cursor
      // avoids cursors stacking up at 0,0
      x: Number.MIN_SAFE_INTEGER,
      y: 0,
      color: colorToString(idToColor(cid)),
      location: null,
      focused: document.hasFocus(),
      botControllerID: '',
      manuallyTriggeredBot: false,
    });
  };

  void ensure();

  return undefined;
}

function useEnsureLocation(
  r: Reflect<M> | null,
  myClientID: string | undefined,
) {
  const [location, setLocation] = useState<Location | null>(null);
  const ignore = false;

  useEffect(() => {
    void fetch('/api/get-location')
      .then(resp => resp.json())
      .then(data => {
        if (ignore) {
          return;
        }
        setLocation(data);
      });
  }, [ignore]);

  useEffect(() => {
    if (r === null || location === null || myClientID === undefined) {
      return;
    }
    void r.mutate.updateClient({
      id: myClientID,
      location: getLocationString(location),
    });
  }, [location, r, myClientID]);
}

function useClientIDs(r: Reflect<M> | null) {
  const clientIDs = useSubscribe(
    r,
    async tx => {
      const clients = await listClients(tx);
      const ids = [];
      for (const client of clients) {
        if ((client.id === tx.clientID, client.focused)) {
          ids.push(client.id);
        }
      }
      return ids;
    },
    [],
  );
  return clientIDs;
}

function useTabIsVisible() {
  const [tabIsVisible, setTabIsVisible] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const onVisibilityChange = () => {
      setTabIsVisible(document.visibilityState === 'visible');
    };
    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);
  return tabIsVisible;
}

export function Demo() {
  const tabIsVisible = useTabIsVisible();
  const puzzleRoomID = 'counter';
  const {r, online} = useReflect(puzzleRoomID);
  const myClientID = useEnsureMyClient(r, tabIsVisible);
  useEnsureLocation(r, myClientID);
  const clientIDs = useClientIDs(r);

  return (
    <section id="intro" className={classNames(styles.section)}>
      {r && myClientID && online && <CursorField r={r} clientIDs={clientIDs} />}
    </section>
  );
}
