FROM node:18
WORKDIR /app

# Install necessary dependencies
RUN apt update && apt install -y msmtp msmtp-mta

COPY package.json ./
RUN npm install
COPY . .

CMD [ "node", "app.js" ]
EXPOSE 3000
