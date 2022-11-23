# Reflect Server API

This doc captures the set of service management APIs that reflect-server provides. These APIs are called by your server or you yourself (e.g., via scripting). This doc does not describe the reflect client API called by the your app.

## Reflect Server is beta software

These APIs might change at any time.

## Authentication

Reflect Server expects a service management auth token to be provided via the `REFLECT_AUTH_API_KEY` env var. This token authorizes privileged administrative operations. It is a shared secret between your server and reflect-server, and must not be shared with end users (via app source code, reflect client, or any other means). If the env var is not set (is undefined), these APIs are disabled.

**Each of the following calls requires the auth api key to be passed via the custom `x-reflect-auth-api-key` HTTP header.** Failure to pass the correct key results in a `401` (Unauthorized).

## Room Management

### <a name="create-room"></a>Create room: `POST /createRoom`

Starting in `0.19.0`, a room must be _created_ before users can connect to it. (Previously, room creation was implicit in `connect`.)

- Request body:
  - `roomID`: string representing the unique id of room to create; must match `[a-zA-Z0-9_-]+`
  - `jurisdiction`: optional string equal to `'eu'` if room data must be kept in the EU. Do not set this field unless you are sure you need it, as it restricts underlying storage options.
- Noteworthy responses:
  - `200` indicating the room has been created
  - `409` (Conflict) indicates the room already exists
- Example

  ```
  ==> POST /createRoom HTTP/1.0
      x-reflect-auth-api-key: ...

      { "roomID": "unj3Ap" }

  <== HTTP/1.0 200 OK
  ```

### <a name="get-room-status"></a>Get room status: `GET /api/room/v0/room/:roomID/status`

- URL path parameters:
  - `roomID`: id of the room to return the status of, eg `unj3Ap`
- Noteworthy responses:
  - `200` with JSON body containing a `status` field that is one of:
    - `"open"`: the room is accepting connections from users.
    - `"closed"`: the room is not accepting connections from users.
    - `"deleted"`: the room is not accepting connections from users _and_ all its content has been deleted.
    - `"unknown"`: no room exists with the given `roomID`
- Example

```
==> GET /api/room/v0/room/unj3Ap/status HTTP/1.0
    x-reflect-auth-api-key: ...

<== HTTP/1.0 200 OK

    { "status": "open" }
```

### <a name="close-room"></a>Close room: `POST /api/room/v0/room/:roomID/close`

A room is _closed_ if it should no longer accept connections from users. A closed room is never re-opened and its `roomID` can never be re-used. Closing a room does not delete its data. Closing a room only prevents users from `connect`ing to the room, it does not log out users who may currently be connected. A call to close the room should likely be followed by a call to the the `auth` API's `invalidateForRoom`, which logs users out.

- URL path parameters:
  - `roomID`: id of the room to close, eg `unj3Ap`
- Noteworthy responses:
  - `200` if room has been successfully closed
  - `409` (Conflict) if the room does not have status `"open"`
- Example

```
==> POST /api/room/v0/room/unj3Ap/close HTTP/1.0
    x-reflect-auth-api-key: ...

<== HTTP/1.0 200 OK

```

### <a name="delete-room"></a>Delete room: `POST /api/room/v0/room/:roomID/delete`

A room is _deleted_ if it no longer accepts connections from users and all its data has been deleted. This condition is permanent. The `roomID` will not be re-usable. In order to be deleted, a room it must first be _closed_. It should also have had its users logged out via `auth`'s `invalidateForRoom`.

- URL path parameters:
  - `roomID`: id of the room to delete, eg `unj3Ap`
- Noteworthy responses:
  - `200` if room has been successfully deleted
  - `409` (Conflict) if the room does not have status `"closed"`
- Example

```
==> POST /api/room/v0/room/unj3Ap/delete HTTP/1.0
    x-reflect-auth-api-key: ...

<== HTTP/1.0 200 OK

```

### <a name="migrate-room"></a>Migrate room: `POST /api/room/v0/room/:roomID/migrate/1`

You only need to use this call in order to migrate rooms created in versions prior to `0.19.0`. Rooms created via `createRoom` in `0.19.0` do not need to be migrated.

Reflect Server version `0.19.0` keeps a record for each room, eg holding its status (open, closed, etc). Versions prior to `0.19.0` do not keep these records, and roomIDs used prior to `0.19.0` are not enumerable by Reflect Server, so you must call this API once for each `roomID` in order to migrate your rooms to be compatible with `0.19.0`.

You can verify that a room was successfully migrated by getting the room status after migration; it should be `"open"`.

This operation is idempotent.

- URL path parameters:
  - `roomID`: id of the room to migrate, eg `unj3Ap`
- Noteworthy responses:
  - `200` if room has been successfully migrated
  - `400` (Bad request) with message `Invalid roomID...` if the `roomID` doesn't match `[a-zA-Z0-9_-]+`
- Example

```
==> POST /api/room/v0/room/unj3Ap/migrate/1 HTTP/1.0
    x-reflect-auth-api-key: ...

<== HTTP/1.0 200 OK

```

## Auth

These APIs have not changed in `0.19.0`.

### Invalidate for user: `POST /api/auth/v0/invalidateForUser`

- Request body:
  - `userID`: string indicating the user to log out eg `user42`
- Example

  ```
  ==> POST /api/auth/v0/invalidateForUser HTTP/1.0
      x-reflect-auth-api-key: ...

      { "userID": "user42" }

  <== HTTP/1.0 200 OK

  ```

### <a name="invalidateForRoom"></a>Invalidate for room: `POST /api/auth/v0/invalidateForRoom`

- Request body:
  - `roomID`: string indicating the room to log all users out of eg `unj3Ap`
- Example

  ```
  ==> POST /api/auth/v0/invalidateForRoom HTTP/1.0
      x-reflect-auth-api-key: ...

      { "roomID": "unj3Ap" }

  <== HTTP/1.0 200 OK

  ```

### Invalidate all: `POST /api/auth/v0/invalidateAll`

- Example

  ```
  ==> POST /api/auth/v0/invalidateAll HTTP/1.0
      x-reflect-auth-api-key: ...

  <== HTTP/1.0 200 OK

  ```

### Revalidate all users in all rooms: `POST /api/auth/v0/revalidateConnections`

- Example

  ```
  ==> POST /api/auth/v0/revalidateConnections HTTP/1.0
      x-reflect-auth-api-key: ...

  <== HTTP/1.0 200 OK

  ```
