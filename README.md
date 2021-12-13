# URL Shortener

A website application which help everyone shorten URL. The web application is based on Express.js server


## Screentshots
### Index Page
![Index Page](https://res.cloudinary.com/dqfxgtyoi/image/upload/v1639377785/github/index_page_zsg3dn.png)
### Result Page
![Result Page](https://res.cloudinary.com/dqfxgtyoi/image/upload/v1639377786/github/result_page_qzot1r.png)
### Copy Result Page 
![Copy Result Page ](https://res.cloudinary.com/dqfxgtyoi/image/upload/v1639377785/github/copybtn_page_iyisjs.png)


## Features
1. Shorten URL into website application URL with URLID
2. Map website application URL with URLID into origin URL

## Requirement
1. Node.js (v14.16.0 is recommended)
2. Mongoose (v6.1.0 is recommended)
3. MongoDB (v4.1.4 is recommended)
4. express-handlebars (v6.0.2 is recommended)


## Installation
1.  Open your terminal, run git clone to copy it to your platform
```
git clone https://github.com/Eklipsorz/URLShortener.git
```

2. Change current directory to URLShortener
```
cd URLShortener
```

3. Install required npm modules
```
npm install
```

4. open your MongoDB server (port:27017) and create a database called URLShortener


5. (Optional) Go back to restaurantList dir and generate a set of seed data for MongoDB database 
```
npm run seed
```

## Quick start
1. Start the web app
```
npm run start
```

2. If you want to develop this project, you can run development mode. (BTW, you might require nodemon)
```
npm run dev
```

3. Open your browser and input the following url

```
http://localhost:3500/
```

## Contributor
[orion (Eklipsorz)](https://github.com/Eklipsorz)