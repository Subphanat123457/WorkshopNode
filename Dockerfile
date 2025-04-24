FROM node:23

WORKDIR /app

COPY package*.json ./

RUN npm i 
RUN npm i bcrypt moongose

COPY . .

EXPOSE 3000

CMD ["node", "bin/www"]
