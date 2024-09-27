# Use an nginx image to serve static files
FROM nginx:alpine

# Copy the static files to the nginx html directory
COPY . /usr/share/nginx/html

EXPOSE 5500
