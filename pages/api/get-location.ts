import type {VercelRequest, VercelResponse} from '@vercel/node';
import https from 'https';

const isInvalidLocation = (location: string | undefined) =>
  !location || location?.length < 6;

const handler = (req: VercelRequest, res: VercelResponse) => {
  let location = req.headers['x-nf-client-connection-ip'] as string | undefined;
  if (isInvalidLocation(location)) {
    res.json({
      city: 'Your Computer',
      country_code: '👋',
    });
  }

  https
    .request(
      `https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&ip_address=${location}`,
      childRes => {
        childRes.setEncoding('utf8');
        let responseStr = '';
        childRes.on('data', (chunk: Buffer) => {
          responseStr += chunk.toString();
        });
        childRes.on('end', () => {
          res.status(res.statusCode || 500).send(responseStr);
        });
      },
    )
    .end();
};

export default handler;
