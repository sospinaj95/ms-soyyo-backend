
# ms-soyyo-backend

Paso 1 

cd ./ms-soyyo-backend
npm install

Paso 2

cd ./ms-soyyo-backend

node .\app.js

Nota: el Servidor queda corriendo el puerto 3010 y la url de consumo es la siguiente:
POST http://localhost:3010/entity/filter
body:
{
    "startId": "1",
    "endId": "500"
}