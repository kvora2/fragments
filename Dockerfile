#Starting our Docker journey from the Fragments microservice

# Stage 0: Install the base dependencies
# setting the base image to be of node and a specific version similar to our system (18.18.2)
FROM node:18.18.2@sha256:a6385a6bb2fdcb7c48fc871e35e32af8daaa82c518900be49b76d10c005864c2 as dependencies

# Some metadata details about our docker image
LABEL maintainer="Kelvin Vora <kelvinvora21@gmail.com>" \
      description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080
# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false
ENV NODE_ENV=production

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app). since we already set the WORKDIR in previous step, it'll be './' now.
COPY package*.json ./

# Install node dependencies defined in package-lock.json (UNDERSTANDING: reuse this INSTALL if package.json is not changed or might need to copy those files again)
RUN npm ci --only=production

########################################################################################################################

#Stage 2: serving the built fragments microservice
FROM node:18.18.2-alpine3.18@sha256:435dcad253bb5b7f347ebc69c8cc52de7c912eb7241098b920f2fc2d7843183d as deploy

USER node
WORKDIR /app

COPY --from=dependencies /app /app

# Copy src to /app/src/
COPY ./src ./src
# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD node ./src/index.js

# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
  CMD wget --quiet --spider http://localhost:8080 || exit 1
