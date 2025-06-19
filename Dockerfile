FROM node:22

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . .

RUN npm i

EXPOSE 3000

CMD [ "npm" ,"run", "dev"]