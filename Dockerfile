FROM node:26-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM node:26-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist/marrso-studio ./dist/marrso-studio
EXPOSE 4000
CMD ["node", "dist/marrso-studio/server/server.mjs"]
