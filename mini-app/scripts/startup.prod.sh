#!/bin/sh

# Скрипт упадет, если какая-либо операция завершалась не удачно. Не позволит запуститься nginx с кривыми envs
set -e

# Переходим в директорию с билдом для nginx
#cd /usr/share/nginx/html

HTML='./index.html'
HTML_TEMPLATE='./index.template.html'

# Очищаем файл
> $HTML

ENVS=''
ENV_PREFIX='PUBLIC_'

# Читаем что находится в env, разделяем на фрагменты ключ-значение
for line in $(env | grep '='); do
  k=${line%%=*}
  v=${line#*=}

  # Берем все env, с префиксом и записываем в ENVS
  case "$k" in
    ${ENV_PREFIX}*)
      if [ -n "$ENVS" ]; then
        ENVS="${ENVS},\"${k}\":\"${v}\""
      else
        ENVS="\"${k}\":\"${v}\""
      fi
      ;;
  esac
done

# Создание index.html с инжектируемыми env переменными

# Читаем content файла
htmlTemplateContent=$(cat "$HTML_TEMPLATE")

# Заменяет window.__ENV__ на значение переменных
newContent=$(echo "$htmlTemplateContent" | sed "s|window.__ENV__={}|window.__ENV__={${ENVS}}|g")

# Перезаписываем html с новым содержимым
echo "$newContent" > "$HTML"

# Подстановка переменных в nginx.conf

# Необходимо экспортировать, тк envsubst является разветвленным процессом и не знает неэкспортируемых переменных
#export PUBLIC_WS_URL

# Подмена указанных переменные в nginx.conf.template и копирование всего файла в nginx.conf
#envsubst "${PUBLIC_WS_URL}" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Запуск nginx
#nginx -g 'daemon off;'
