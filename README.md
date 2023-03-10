
#### Tech Stach
> Typescript , Express , Mongo , Joi , Redis 
##How to Run
##### Sample Env
```
PORT= 8888
DB_URL= mongodb://0.0.0.0:27017/Geo
JWT_SECRET= "secret"
```

##### Install Dependencies
```
npm install
```

##### Run
First run the redis server
```
redis-server
```

 > the redis server must be running before running the server unfortunately redis do not have an windows installer so you'll have to either use Linux or WSL

Then run the server
```
npm run dev
```

##### Populate DB
There are  two ways to populate the DB
* Via the API
* Writing directly to the DB

run the file you want by either running the script using npm or
```
ts-node populateDb.ts
```

inside the scripts folder

```
$ npm run populateDbApi
Or
$ npm run populateDb
```
 Tested on windows 11 

 ## Endpoints

 ```
 
 GET> http://localhost:8888/api/ghg_emissions?country=Australia&start_year=2000&end_year=2030

 and

 GET> http://localhost:8888/api/ghg_emissions?country=Australia&start_year=2000&end_year=2030&parameter=CO2
 ```


```
POST > http://localhost:8888/api/ghg_emissions
{
    "country": "Australia",
    "year": 2000,
    "parameter": "CO2",
    "value": 100
}
```

```
Require Auth
POST > http://localhost:8888/api/ghg_emissions/auth
{
    "country": "Australia",
    "year": 2000,
    "parameter": "CO2",
    "value": 100
}
```




### Miscs 
There is code to implement clustering which is commented out in the server.ts file if you want to use it you can uncomment it and it should work fine
however it have long startup time and it's not recommended to use it in development unless you have a lot of cores and a lot of RAM