FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config if we had routing issues, but standard is okay for now
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
