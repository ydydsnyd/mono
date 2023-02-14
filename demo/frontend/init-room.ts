import {nanoid} from 'nanoid';

export const initRoom = async () => {
  // Find our current room by checking if we were given one explicitly,
  // or falling back to any previously stored one.
  let roomID = window.location.hash.replace(/^#/, '');
  if (!roomID) {
    roomID = localStorage.getItem('roomID') ?? '';
  }

  // If we still don't have a roomID, allocate a new one.
  if (!roomID) {
    roomID = nanoid();
    await fetch('/api/create-room', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({roomID}),
    });
  }

  localStorage.setItem('roomID', roomID);

  // Once we know our room, remove the fragment.
  if (window.location.hash) {
    window.location.replace('#');
    // slice off the remaining # if we can
    if (typeof window.history.replaceState == 'function') {
      history.replaceState({}, '', window.location.href.slice(0, -1));
    }
  }

  return roomID;
};
