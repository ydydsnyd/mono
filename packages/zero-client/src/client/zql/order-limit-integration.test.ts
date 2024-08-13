import {describe, expect, test} from 'vitest';
import {makeComparator} from 'zql/src/zql/ivm/compare.js';
import {Comparator, joinSymbol} from 'zql/src/zql/ivm/types.js';
import {must} from '../../../../shared/src/must.js';
import {
  Album,
  Artist,
  Track,
  TrackArtist,
  bulkSet,
  createRandomAlbums,
  createRandomArtists,
  createRandomTracks,
  linkTracksToArtists,
  musicAppQueries,
  newZero,
} from './integration-test-util.js';

describe('sorting and limiting with different query operations', async () => {
  const z = newZero(musicAppQueries);
  const artists = createRandomArtists(50);
  const albums = createRandomAlbums(50, artists);
  const tracks = createRandomTracks(100, albums);
  const trackArtists = linkTracksToArtists(artists, tracks, {
    allTracksMustHaveAnArtist: true,
  });
  await bulkSet(z, {artists, albums, tracks, trackArtists});

  const indexedArtists = artists.reduce(
    (acc, a) => {
      acc[a.id] = a;
      return acc;
    },
    {} as Record<string, Artist>,
  );
  const indexedTrackArtists = trackArtists.reduce(
    (acc, a) => {
      acc[a.trackId] = acc[a.trackId] || [];
      acc[a.trackId].push(a);
      return acc;
    },
    {} as Record<string, TrackArtist[]>,
  );

  const joinAlbumToArtist = (album: Album) => {
    const artist = must(indexedArtists[album.artistId]);
    return {
      id: `${album.id}:${artist.id}`,
      album,
      artist,
      [joinSymbol]: true,
    } as const;
  };

  const joinTrackToArtists = (t: Track) => {
    const tas = indexedTrackArtists[t.id];
    return tas.map(ta => {
      const a = indexedArtists[ta.artistId];
      return {
        id: `${t.id}:${ta.id}:${a.id}`,
        [joinSymbol]: true,
        track: t,
        trackArtist: ta,
        artist: a,
      };
    });
  };

  const groupTracksByAlbum = (comp: Comparator<Track>) => {
    const grouped = tracks.sort(comp).reduce(
      (acc, t) => {
        acc[t.albumId] = acc[t.albumId] || [];
        acc[t.albumId].push(t);
        return acc;
      },
      {} as Record<string, Track[]>,
    );
    const ret: Track[] = [];
    for (const key of Object.keys(grouped)) {
      ret.push(grouped[key][0]);
    }
    return ret.sort(comp);
  };

  const canonicalComparator = makeComparator([[['unused', 'id'], 'asc']]);

  test.each([
    {
      name: 'Select with a limit and no orderBy',
      query: () => z.query.artist.limit(10),
      expected: () => artists.sort(canonicalComparator).slice(0, 10),
    },
    {
      name: 'Select with a limit and orderBy, asc',
      query: () => z.query.artist.orderBy('artist.name', 'asc').limit(10),
      expected: () =>
        artists
          .sort(
            makeComparator([
              [['artist', 'name'], 'asc'],
              [['artist', 'id'], 'asc'],
            ]),
          )
          .slice(0, 10),
    },
    {
      name: 'Select with a limit and orderBy, desc',
      query: () => z.query.artist.orderBy('artist.name', 'desc').limit(10),
      expected: () =>
        artists
          .sort(
            makeComparator([
              [['artist', 'name'], 'desc'],
              [['artist', 'id'], 'desc'],
            ]),
          )
          .slice(0, 10),
    },
    {
      name: 'Select with limit, orderBy and constraint on orderBy field',
      query: () =>
        z.query.track
          .orderBy('track.title', 'asc')
          .where('track.title', '>', 'F')
          .limit(3),
      expected: () =>
        tracks
          .filter(t => t.title > 'F')
          .sort(
            makeComparator([
              [['track', 'title'], 'asc'],
              [['track', 'id'], 'asc'],
            ]),
          )
          .slice(0, 3),
    },
    {
      name: 'Select with a join and limit. Default order',
      query: () =>
        z.query.album
          .join(z.query.artist, 'artist', 'artistId', 'id')
          .limit(10),
      expected: (): {artist: Artist; album: Album}[] =>
        albums
          .map(joinAlbumToArtist)
          .sort(
            makeComparator([
              [['album', 'id'], 'asc'],
              [['artist', 'id'], 'asc'],
            ]),
          )
          .slice(0, 10),
    },
    {
      name: 'Select with a join, no limit. ID order, desc',
      query: () =>
        z.query.album
          .join(z.query.artist, 'artist', 'artistId', 'id')
          .orderBy('album.id', 'desc'),
      expected: (): {artist: Artist; album: Album}[] =>
        albums
          .map(joinAlbumToArtist)
          .sort((l, r) => canonicalComparator(r.album, l.album)),
    },
    {
      name: 'Select with a join, limit and orderBy',
      query: () =>
        z.query.album
          .join(z.query.artist, 'artist', 'artistId', 'id')
          .orderBy('album.title', 'asc')
          .limit(10),
      expected: (): {artist: Artist; album: Album}[] =>
        albums
          .map(joinAlbumToArtist)
          .sort(
            makeComparator([
              [['album', 'title'], 'asc'],
              [['album', 'id'], 'asc'],
              [['artist', 'id'], 'asc'],
            ]),
          )
          .slice(0, 10),
    },
    {
      name: 'Select with a join, limit and orderBy, desc',
      query: () =>
        z.query.album
          .join(z.query.artist, 'artist', 'artistId', 'id')
          .orderBy('album.title', 'desc')
          .limit(10),
      expected: (): {artist: Artist; album: Album}[] => {
        const c = makeComparator([
          [['album', 'title'], 'desc'],
          [['album', 'id'], 'desc'],
        ]);
        return albums.map(joinAlbumToArtist).sort(c).slice(0, 10);
      },
    },
    {
      name: '3-way join, no limits, ordered, asc',
      query: () =>
        z.query.track
          .join(z.query.trackArtist, 'trackArtist', 'id', 'trackId')
          .join(z.query.artist, 'artist', 'trackArtist.artistId', 'id')
          .orderBy('track.title', 'asc')
          .orderBy('artist.name', 'asc'),
      expected: () => {
        const c = makeComparator([
          [['track', 'title'], 'asc'],
          [['artist', 'name'], 'asc'],
          [['track', 'id'], 'asc'],
        ]);
        return tracks.flatMap(joinTrackToArtists).sort(c);
      },
    },
    {
      name: '3-way join, no limits, ordered, desc',
      query: () =>
        z.query.track
          .join(z.query.trackArtist, 'trackArtist', 'id', 'trackId')
          .join(z.query.artist, 'artist', 'trackArtist.artistId', 'id')
          .orderBy('track.title', 'desc')
          .orderBy('artist.name', 'desc'),
      expected: () => {
        const c = makeComparator([
          [['track', 'title'], 'desc'],
          [['artist', 'name'], 'desc'],
          [['track', 'id'], 'desc'],
        ]);
        return tracks.flatMap(joinTrackToArtists).sort(c);
      },
    },
    {
      name: 'group-by, no limit',
      query: () => z.query.track.groupBy('track.albumId'),
      expected: () => groupTracksByAlbum(canonicalComparator),
    },
    {
      name: 'group-by, limit 10',
      query: () => z.query.track.groupBy('track.albumId').limit(10),
      expected: () => groupTracksByAlbum(canonicalComparator).slice(0, 10),
    },
    {
      name: 'group-by limit 10 desc',
      query: () =>
        z.query.track
          .groupBy('track.albumId')
          .orderBy('track.title', 'desc')
          .limit(10),
      expected: () =>
        groupTracksByAlbum(
          makeComparator([
            [['track', 'title'], 'desc'],
            [['track', 'albumId'], 'desc'],
          ]),
        )
          .sort(
            makeComparator([
              [['track', 'title'], 'desc'],
              [['track', 'albumId'], 'desc'],
            ]),
          )
          .slice(0, 10),
    },
    {
      name: '3-way join, limits, ordered, asc',
      query: () =>
        z.query.track
          .join(z.query.trackArtist, 'trackArtist', 'id', 'trackId')
          .join(z.query.artist, 'artist', 'trackArtist.artistId', 'id')
          .limit(10)
          .orderBy('track.title', 'asc')
          .orderBy('artist.name', 'asc'),
      expected: () => {
        const c = makeComparator([
          [['track', 'title'], 'asc'],
          [['artist', 'name'], 'asc'],
          [['track', 'id'], 'asc'],
          [['trackArtist', 'id'], 'asc'],
          [['artist', 'id'], 'asc'],
        ]);
        return tracks.flatMap(joinTrackToArtists).sort(c).slice(0, 10);
      },
    },
    {
      name: '3-way join, limits, ordered, desc',
      query: () =>
        z.query.track
          .join(z.query.trackArtist, 'trackArtist', 'id', 'trackId')
          .join(z.query.artist, 'artist', 'trackArtist.artistId', 'id')
          .orderBy('track.title', 'desc')
          .orderBy('artist.name', 'desc')
          .limit(10),
      expected: () => {
        const c = makeComparator([
          [['track', 'title'], 'desc'],
          [['artist', 'name'], 'desc'],
          [['track', 'id'], 'desc'],
          [['trackArtist', 'id'], 'desc'],
          [['artist', 'id'], 'desc'],
        ]);
        return tracks.flatMap(joinTrackToArtists).sort(c).slice(0, 10);
      },
    },
  ])('$name', async ({query, expected}) => {
    const stmt = query().prepare();
    const rows = await stmt.exec();
    stmt.destroy();

    const e = expected();

    expect(rows).toEqual(e);
  });
});
