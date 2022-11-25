APP=$(jq -r ".name" < package.json)
VERSION=$(jq -r ".version" < package.json)

case $1 in
start)
  nohup npm run start &> "${APP}.log"
  echo $! > "${APP}.pid"
  ;;
stop)
  if [[ -f "${APP}.pid" ]]; then
    kill -9 "$(cat "${APP}".pid)"
    rm -rf "${APP}.pid"
  fi
  ;;
build)
  docker build -f ci/Dockerfile -t "${APP}:${VERSION}" .
  ;;
*)
  echo "USAGE: ./cli.sh <start|stop|build>"
  ;;
esac
