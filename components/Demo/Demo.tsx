import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {DemoAPI, init} from '@/demo/frontend';
import {DEBUG_TEXTURES} from '@/demo/frontend/constants';
import Preload from './Preload';
import type {RoomRecording} from '@/demo/shared/types';
import {useSearchParams} from 'next/navigation';
import styles from '@/styles/Demo.module.css';
import classNames from 'classnames';

let initPromise: Promise<DemoAPI> | undefined;
const initOnce = () => {
  if (initPromise) {
    return initPromise;
  }
  initPromise = init();
  return initPromise;
};

const animationDuration = 500;

const PaintFight = () => {
  const searchParams = useSearchParams();
  const showDebug = searchParams.has('debug');
  const [initError, setInitError] = useState<Error | undefined>(undefined);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [showRecordings, setShowRecordings] = useState<boolean>(false);
  const [playRecording, setPlayRecording] =
    useState<(id: string) => Promise<void>>();
  const [toggleRecording, setToggleRecording] = useState<() => Promise<void>>();
  const [deleteRecording, setDeleteRecording] =
    useState<(id: string) => Promise<void>>();
  const [activeRecordings, setActiveRecordings] = useState<RoomRecording[]>();
  const [actorId, setActorId] = useState<string>();
  const [currentRecordingId, setCurrentRecordingId] = useState<string>();
  const [recordings, setRecordings] =
    useState<{id: string; frames: number}[]>();
  // useEffect so this fires after load
  useEffect(() => {
    let durationElapsed = false;
    let wasInitialized = false;
    initOnce()
      .catch(error => {
        setInitError(error);
        console.error(error);
      })
      .then(api => {
        if (api) {
          const refresh = async () => {
            const i = await api.getRecordings();
            setActorId(i.actorId);
            setActiveRecordings(i.activeRecordings);
            setRecordings(i.recordings);
            setCurrentRecordingId(i.currentRecordingId);
          };
          // This API is horrible, but basically if the value is a function, React will
          // invoke it as a transformer. So we need to wrap any function values with a
          // function.
          setPlayRecording(() => async (id: string) => {
            await api.playRecording(id);
            await refresh();
          });
          setDeleteRecording(() => async (id: string) => {
            await api.deleteRecording(id);
            await refresh();
          });
          setToggleRecording(() => async () => {
            api.toggleRecording();
            await refresh();
          });
          refresh();
          api.onRefresh(refresh);
        }
        if (durationElapsed) {
          setInitialized(true);
        } else {
          wasInitialized = true;
        }
      });
    setTimeout(() => {
      if (wasInitialized) {
        setInitialized(true);
      } else {
        durationElapsed = true;
      }
    }, animationDuration);
  }, []);

  const isPlaying = (id: string) =>
    activeRecordings?.find(ar => ar.recordingId === id) ||
    currentRecordingId === id;

  return (
    <>
      {showDebug ? (
        <div id="debug">
          <pre className="content"></pre>
          <div
            className={classNames(styles.recordings, {
              [styles.panelShowing]: showRecordings,
            })}
          >
            <div
              className={styles.toggleShowButton}
              onClick={() => setShowRecordings(!showRecordings)}
            >
              🎥 Recordings
            </div>
            <button
              className={styles.recordButton}
              onClick={() => toggleRecording?.()}
            >
              {currentRecordingId ? '⏹ Stop Recording (⌥R)' : '🔴 Record (⌥R)'}
            </button>
            {recordings?.length ? <h4>Recordings</h4> : null}
            <ul className={styles.recordingsList}>
              {recordings?.map(recording => (
                <li key={recording.id} className={styles.recording}>
                  {isPlaying(recording.id) ? null : (
                    <>
                      <button onClick={() => playRecording?.(recording.id)}>
                        ▶️
                      </button>
                      <button onClick={() => deleteRecording?.(recording.id)}>
                        ❌
                      </button>
                    </>
                  )}
                  <span>
                    {recording.id}: {recording.frames} frames
                  </span>
                </li>
              ))}
            </ul>
            {activeRecordings?.length ? <h4>Playing Recordings</h4> : null}
            <ul
              className={classNames(
                styles.playingRecordings,
                styles.recordingsList,
              )}
            >
              {activeRecordings?.map(recording => (
                <li key={recording.recordingId}>
                  {recording.broadcasterId === actorId ? '🎥' : '🍿'}{' '}
                  {recording.recordingId} as {recording.botId}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      {initError ? `${initError?.message}` : null}
      <div id="demo">
        <Preload
          animationDuration={animationDuration}
          className={initialized ? 'loaded' : ''}
        />
        <canvas id="canvas3D" className={initialized ? 'loaded' : ''}></canvas>
      </div>
      <div className={`canvases ${DEBUG_TEXTURES ? ' debug' : ''}`}>
        {DEBUG_TEXTURES ? <Canvases id="caches" /> : null}
        {DEBUG_TEXTURES ? <Canvases id="server-caches" /> : null}
      </div>
      <div id="info">
        <div className="active-user-info">
          <div className="online-dot offline"></div>
          &nbsp;Active users:&nbsp;
          <span id="active-user-count">1</span>
        </div>
        <button id="reset-button">
          <div className="copy">
            <Image
              src="/img/clear.svg"
              className="icon"
              alt=""
              width={16}
              height={16}
            />
            &nbsp;Clear Paint
          </div>
          <div className="success">
            <Image
              src="/img/success.svg"
              className="icon"
              alt=""
              width={16}
              height={16}
            />
            &nbsp;Cleared
          </div>
        </button>
      </div>
    </>
  );
};

export default PaintFight;

const Canvases = ({id}: {id: string}) => (
  <div id={id}>
    <canvas className="a"></canvas>
    <canvas className="l"></canvas>
    <canvas className="i"></canvas>
    <canvas className="v"></canvas>
    <canvas className="e"></canvas>
  </div>
);
