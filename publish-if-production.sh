[[ -z "$VERCEL_PRODUCTION_BUILD" ]] && exit 0;

npm install
npm run publish-worker-prod
