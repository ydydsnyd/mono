# Reflect Server Development API

These are some additional APIs supported by Reflect Server that shouldn't be needed in the normal course of operation. They might be useful if you are developing Reflect Server or to understand or recover from something that went wrong with migration to `0.19.0`.

**These calls require that the custom HTTP header `x-reflect-auth-api-key` contains the auth API key.**

### Forget room: `POST /api/room/v0/room/:roomID/DANGER/forget"`

Removes the room record for the given room. Without a room record, users will not be able to connect to the room in `0.19.0`. A room record can be created by calling the Migrate room API endpoint.

- Request body:
  - `roomID`: id of the room to "forget" (delete the room record of)
- Noteworthy responses:
  - `200` indicating the room has been forgotten
  - `404` there is no record of the room with given id
- Example

  ```
  ==> POST /api/room/v0/room/unj3Ap/DANGER/forget HTTP/1.0
      x-reflect-auth-api-key: ...

      { "roomID": "unj3Ap" }

  <== HTTP/1.0 200 OK
  ```

### Get room records: `GET /api/room/v0/rooms`

Returns the set of all room records Reflect Server knows about.

- Response body
  - `[{...}, ...]` an array of internal-to-reflect-server room records, one per room, that Reflect Server knows about
- Example

```
==> GET /api/room/v0/rooms HTTP/1.0
    x-reflect-auth-api-key: ...

<== HTTP/1.0 200 OK

    [{ "status": "open",
       "roomID": "ubj3Ap",
       "objectIDString": "...",
       "jurisdiction": "",
       ... },
     ...]
```
