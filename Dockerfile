#Starting our Docker journey from the Fragments microservice
# setting the base image to be of node and a specific version similar to our system (18.18.2)
FROM node:18.18.2

# Some metadata details about our docker image
LABEL maintainer="Kelvin Vora <kelvinvora21@gmail.com>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app). since we already set the WORKDIR in previous step, it'll be './' now.
COPY package*.json ./

# Install node dependencies defined in package-lock.json (UNDERSTANDING: reuse this INSTALL if package.json is not changed or might need to copy those files again)
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080
