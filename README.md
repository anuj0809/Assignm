# BitespeedAssignment
Bitespeed Backend Assignment

## Sample Curl Request 

```
curl --location 'localhost/identify' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email": "test8@gmail.com",
	"phoneNumber": "3333333334"
}'
```

## To start the program 
```
npm start 
```

## Important Note: Please add additional .env file at root for running the program 
### Sample .env file 

```
PG_USER=<username>
PG_PASSWORD=<password>
PG_HOST='localhost'
PG_PORT=5432
PG_DATABASE='bitespeed'
ISMIGRATION=false
PORT=80
ENV='development'
```

This is a solution for the problem defined in 
https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-53392ab01fe149fab989422300423199
