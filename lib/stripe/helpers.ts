import { Price } from '@/lib/types/types';

export const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ??
    'http://localhost:3000';

  url = url.includes('http') ? url : `https://${url}`;
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

  return url;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log('POSTING DATA', url, data);

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log('Error posting data', { url, data, res });
    throw new Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  const t = new Date('1970-01-01T00:00:00Z');
  t.setSeconds(secs);
  return t;
};
