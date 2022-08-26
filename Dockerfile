FROM node:10.16.3-jessie
WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3010
ENV URL=
ENV NODE_ENV=development

EXPOSE 3010
CMD ["node", "app.js"]
