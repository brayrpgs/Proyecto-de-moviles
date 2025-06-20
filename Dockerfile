FROM node:22

RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libxshmfence1 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libgtk-3-0 \
  xdg-utils \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*


RUN mkdir -p /home/app
WORKDIR /home/app


COPY . .


RUN npm install


RUN npx puppeteer browsers install chrome

EXPOSE 3000

CMD ["npm", "run", "dev"]
