FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY . .
RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma generate && npm run dev"]