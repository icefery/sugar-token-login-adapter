APP_NAME=$(jq -r ".name" < package.json)
APP_VERSION=$(jq -r ".version" < package.json)

case $1 in
start)
  nohup npm run start &> "${APP_NAME}.log" &
  echo $! > "${APP_NAME}.pid"
  ;;
stop)
  if [[ -f "${APP_NAME}.pid" ]]; then
    ps -ef | grep "${APP_NAME}" | grep -v grep | awk '{print $2}' | xargs kill -9
    rm -rf "${APP_NAME}.pid"
  fi
  ;;
build)
  docker build -f ci/Dockerfile -t "${APP_NAME}:${APP_VERSION}" .
  ;;
*)
  echo "USAGE: $0 <start|stop|build>"
  ;;
esac
