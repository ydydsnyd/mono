const isProd = process.env.NODE_ENV === 'production';

export {
  isProd as skipCommitDataAsserts,
  isProd as skipAssertJSONValue,
  isProd as skipBTreeNodeAsserts,
  isProd as skipGCAsserts,
  isProd as skipFrozenAsserts,
  isProd as skipFreeze,
};
