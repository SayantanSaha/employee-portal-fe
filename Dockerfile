FROM node:19-alpine AS build
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build
# Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /app/dist/employee-portal/ /usr/share/nginx/html
EXPOSE 80

# RUN npm install
# ENTRYPOINT ['npm','start']
# EXPOSE 4200