FROM node:22-alpine AS build

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

COPY . .

# Удаляем prepare скрипт, чтобы исключить установку husky
RUN npm pkg delete scripts.prepare
# Игнорируются devDependency при установке зависимостей
RUN npm i --production

RUN npm run build

FROM fholzer/nginx-brotli:v1.19.1

COPY .nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Запускаем контейнер при помощи exec в shell оболочке, чтобы иметь доступ к env
ENTRYPOINT ["sh", "/usr/share/nginx/html/scripts/startup.prod.sh"]
