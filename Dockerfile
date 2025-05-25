# Dockerfile for Frontend
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Production environment
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
