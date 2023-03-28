import {BOT_RANDOM_LOCATIONS} from '../shared/constants';

export const getUserLocation = async (backoff = 1000): Promise<string> => {
  try {
    const data = await fetch('/api/get-location');
    const {flag, city} = (await data.json()) as {
      country: string;
      city: string;
      flag: string;
      region: number;
    };
    return `${city} ${flag}`;
  } catch (e) {
    console.log('Failed to update location', e);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        getUserLocation().then(resolve).catch(reject);
      }, backoff * 1.5);
    });
  }
};

export const getRandomLocation = () => {
  return BOT_RANDOM_LOCATIONS[
    Math.floor(Math.random() * BOT_RANDOM_LOCATIONS.length)
  ];
};
