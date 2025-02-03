#!/bin/bash
# Создает index.html файл на основе index.template.html и инжектирует в него env

# Скрипт упадет, если какая-либо операция завершалась не удачно
set -e

HTML='./index.html'
HTML_TEMPLATE='./index.template.html'

# Очищаем файл
> $HTML

ENVS=''
ENV_PREFIX='PUBLIC_'

# Читаем что находится в .env.local и отфильтровываем комментарии
for line in $(cat ./.env.local | grep -v '^#' | grep '='); do
  IFS='=' read -r k v <<< "$line"
  k="${k//\"/\\\"}"  # escape double quotes in key
  v="${v//\"/\\\"}"  # escape double quotes in value

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

# Читаем content файла
htmlTemplateContent=$(cat "$HTML_TEMPLATE")

# Заменяет window.__ENV__ на значение переменных
newContent=$(echo "$htmlTemplateContent" | sed "s|window.__ENV__={}|window.__ENV__={${ENVS}}|g")

# Перезаписываем html с новым содержимым
echo "$newContent" > "$HTML"
