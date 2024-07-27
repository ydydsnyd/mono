{
  /**
   * @template T
   * @param request {IDBRequest<T>}
   * @returns {Promise<T>}
   */
  const wrap = request =>
    new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

  const db = await wrap(indexedDB.open('rep:T0ykzdzZXn:7'));
  const store = db.transaction('chunks', 'readonly').objectStore('chunks');
  console.log(
    await wrap(
      store.getAll(
        IDBKeyRange.lowerBound(
          'c/3b311b9eb46c4e84bd0971a98da83953000000009763/r',
        ),
        3,
      ),
    ),
  );
  console.log(
    await wrap(
      store.getAllKeys(
        IDBKeyRange.lowerBound(
          'c/3b311b9eb46c4e84bd0971a98da83953000000009763/r',
        ),
        3,
      ),
    ),
  );
}
