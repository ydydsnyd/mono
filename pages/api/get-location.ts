import type {VercelRequest, VercelResponse} from '@vercel/node';

const getFlagEmoji = (country: string) => {
  const codePoints = country
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const handler = (req: VercelRequest, res: VercelResponse) => {
  const country = req.headers['x-vercel-ip-country'] as string;
  const city = decodeURIComponent(req.headers['x-vercel-ip-city']) as string;
  const region = req.headers['x-vercel-ip-country-region'] as string;

  if (!country) {
    res.json({
      city: 'You',
      country: '??',
      flag: '👋',
      region: -1,
    });
    return;
  }
  return res.json({
    city,
    country,
    region,
    flag: getFlagEmoji(country),
  });
};

export default handler;
