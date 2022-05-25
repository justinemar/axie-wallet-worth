---

# Axiefloor Server

## Setup

At least node 14.0.0 as specified in package.json engines.
* Redis Server (Required)
  https://redis.io/docs/getting-started/installation/install-redis-on-windows/
  
  after successful installation
  
  ```bash
    sudo service redis-server start
  ```
  
* Redis Commander (useful not required)

  ```bash
    npx redis-commander
  ```
  
  locate http://127.0.0.1:8081/ for visual guys
  
 
## Running

```bash
  npm install
```

For development
```bash
  npm run start:dev
```

## If re-deploying to heroku or to other service.

Make sure you have `.env` file.

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_TTL=86400 // 24 hrs
NODE_ENV=development
REDIS_PASSWORD=my-redis-pass // if connecting to online redis server such as those from redis labs
```

## Debugging logs via heroku

```bash
heroku logs
```

or 

```bash
heroku logs --tail
```
