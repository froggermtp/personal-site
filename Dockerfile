FROM node:12.20.2 as base
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY /src /utils ./.eleventy.js ./gulpfile.js /app/
EXPOSE 8080
ENTRYPOINT ["npm", "run"]
CMD ["start"]