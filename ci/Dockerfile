FROM --platform=${TARGETPLATFORM} node:lts AS build
ENV WORKDIR=/app
WORKDIR ${WORKDIR}
COPY . .
RUN ["npm", "install", "--production"]

FROM --platform=${TARGETPLATFORM} node:lts-alpine
ENV WORKDIR=/app
ENV BASE_URL
WORKDIR ${WORKDIR}
COPY --from=build ${WORKDIR}/node_modules ${WORKDIR}/node_modules
COPY --from=build ${WORKDIR}/public ${WORKDIR}/public
COPY --from=build ${WORKDIR}/package.json ${WORKDIR}/package.json
COPY --from=build ${WORKDIR}/babel.config.json ${WORKDIR}/babel.config.json
COPY --from=build ${WORKDIR}/main.js ${WORKDIR}/main.js
EXPOSE 8000
CMD ["npm", "run", "start"]
