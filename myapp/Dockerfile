FROM node

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install
RUN npm i -g pm2

EXPOSE 3333

# CMD node app.js
CMD npm run start1
