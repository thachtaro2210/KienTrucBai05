# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Sếp có thể pass ARG lúc docker-compose build nếu chạy IP khác
ARG VITE_USER_SERVICE_URL
ARG VITE_FOOD_SERVICE_URL
ARG VITE_ORDER_SERVICE_URL
ARG VITE_PAYMENT_SERVICE_URL
RUN node ./node_modules/vite/bin/vite.js build

# Stage 2: Serve the built static files with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Xóa cấu hình Nginx mặc định, thay bằng React Router Config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
