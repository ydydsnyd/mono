import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {
  APP_COLLECTION,
  appViewDataConverter,
} from 'mirror-schema/src/external/app.js';
import {
  userPath,
  userViewDataConverter,
} from 'mirror-schema/src/external/user.js';
import {must} from 'shared/src/must.js';

export async function getAppsByTeamAndName(
  firestore: Firestore,
  userID: string,
  name?: string,
) {
  const teamID = await getSingleAdminTeam(firestore, userID);
  let q = query(
    collection(firestore, APP_COLLECTION).withConverter(appViewDataConverter),
    where('teamID', '==', teamID),
  );
  if (name) {
    q = query(q, where('name', '==', name));
  }
  const apps = await getDocs(q);
  return apps.docs.map(doc => ({id: doc.id, name: doc.data().name}));
}

export async function getSingleAdminTeam(
  firestore: Firestore,
  userID: string,
): Promise<string> {
  const userDoc = await getDoc(
    doc(firestore, userPath(userID)).withConverter(userViewDataConverter),
  );
  if (!userDoc.exists()) {
    throw new Error('UserDoc does not exist.');
  }
  const {roles} = must(userDoc.data());
  const adminTeams = Object.entries(roles)
    .filter(([_, role]) => role === 'admin')
    .map(([teamID]) => teamID);
  switch (adminTeams.length) {
    case 0:
      throw new Error('You are not an admin of any teams');
    case 1:
      return adminTeams[0];
    default:
      throw new Error(
        'This version of @rocicorp/reflect does not support multiple teams. Please update to the latest version.',
      );
  }
}
