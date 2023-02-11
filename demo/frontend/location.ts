export const getUserLocation = async (backoff = 1000): Promise<string> => {
  try {
    const data = await fetch('/api/get-location');
    const {country_code, city} = (await data.json()) as {
      country_code: string;
      city: string;
    };
    return `${city}, ${country_code}`;
  } catch (e) {
    console.log('Failed to update location', e);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        getUserLocation().then(resolve).catch(reject);
      }, backoff * 1.5);
    });
  }
};
