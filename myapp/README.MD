# PAD lab2 WebProxy

Тематика выбранной темы - Автодилер или автомобильный агрегатор через который ежегодно продаётся более полутора миллионов подержанных машин

## Etap 1

1. Имеется база данных, как хранилище информации об автомобилях

2. Доступ к этой базе данных осуществляется по протоколу HTTP через сервер

   a. Метод GET будет использоваться клиентом для запроса данных

   b. Метод POST будет использоваться клиентом для отправки данных

   c. Метод PUT будет использоваться клиентом для обновления данных



3. структура хранимых данных JSON имеет следующий вид и является моделью конкретного автомобиля в системе (базе данных):

```bash
{ 
  "prod": "BMW", 
  "quality": "used", 
  "color": "black", 
  "year": 2019, 
  "wheel": "left", 
  "picture": "URL", 
  "bodyType": "SUV", 
  "fuel": "diesel", 
  "transmission": "Manual", 
  "capacity": "1167 cm3", 
  "drive": "Front Wheel Drive ", 
  "price": "$3,477.69", 
  "description": "Pariatur sunt labore aute id ex in ex fugiat est reprehenderit ea. Occaecat exercitation aliqua ea non laboris mollit dolor sunt ullamco labore. Quis Lorem excepteur consequat Lorem aliquip. Consequat ipsum dolore cupidatat Lorem eiusmod non labore dolore nisi excepteur velit." 
  },

```

## Etap 2

1. В качество reverse proxy используется веб-сервер Nginx - как посредник между клиентским приложением и конечным сервером.

2. В качестве load balancer(балансировка нагрузки) так же используется Nginx

3. Для кэширования и в последующем для уменьшения количества запросов к конечным серверам - используется Redis


## Реализация

###  1. Элементы системы

a. Система развернута на операционной системе Ubuntu используя Docker — программное обеспечение 
для автоматизации развёртывания и управления приложениями в средах с поддержкой контейнеризаци

b. Веб-Сервер Nginx развернут в той же среде и слушает порт 80

c. Основные вычислителения выполняются серверами, имплементированные на языке и среде разработки Node.js. 

Таких серверов запущено 3 экземпляра на разных портах: 3000, 4000, 5000 

С помощью Nginx нагрузка распределяется между этими инстансами

Config файл Nginx в нашем случае выглядет следующим образом

```bash
upstream padlab2 {
        server localhost:3000;
        server localhost:4000;
        server localhost:5000;

}
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;

        server_name _;

        location / {
                proxy_pass http://padlab2;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }
}
```
d. Redis сервер в нашем случае используется в качестве кэшируещего слоя, - запущен на порту 6379

Основные методы Redis 

```bash
SET cardata '{
  "prod": "BMW", 
  "quality": "used", 
  "color": "black", 
    ...}'
```


```bash
GET cardata

"prod": "BMW", 
"quality": "used", 
"color": "black",
  ... 
```
e. В качестве распределенной базы данных используется MongoDB, которая дает возможноть быстрого и удобного горизонтального масштабированя используя разные методы

Например: Шардинг — это стандартный способ горизонтального масштабирования MongoDB. 

Шард содержит подмножество сегментированных данных для сегментированного кластера. Вместе сегменты кластера содержат весь набор данных для кластера.

Запущен на порту 27100

