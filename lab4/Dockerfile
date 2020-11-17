FROM node:14

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src
ADD /package.json /src/package.json
RUN npm install

EXPOSE 3000
COPY . .
CMD npm run dev