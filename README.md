# Donation form

Форма для пожертвований.

## Сборка приложения.

### Сборка приложения локально

1. Развернуть репозиторий с помощью `git clone`

2. Установить зависимости серверной части `npm install`

3. Установить зависимости клиентской части `cd client && npm install && cd ..`

4. В папке config создать файл default.json
```json
{
  "PORT": 5000,
  "MONGO": {
    "URI": ""
  }
}
```
где `MONGO.URI` это ссылка на подключение к mongodb

5. Собрать клиентскую часть приложения `npm run client_build`

6. Поднять сервер командой `npm run dev`

7. Сайт будет доступен по ссылке [http://localhost:5000/](http://localhost:5000/) или [http://localhost:8080/](http://localhost:8080/) клиентская часть с автообновлением.

### Сборка для сервера

1. Развернуть репозиторий с помощью `git clone`

2. Установить зависимости серверной части `npm install`

3. Установить зависимости клиентской части `cd client && npm install && cd ..`

4. В папке config создать файл production.json
```json
{
  "PORT": 8080,
  "MONGO": {
    "URI": ""
  }
}
```
где `MONGO.URI` это ссылка на подключение к mongodb. В параметр `PORT` укажите порт который используется на сервере.

5. Собрать клиентскую часть приложения `npm run client_build`

6. Поднять сервер командой `npm run up`
