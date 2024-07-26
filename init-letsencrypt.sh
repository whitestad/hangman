#!/bin/bash

if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

domains=(esta-portfolio.ru)
rsa_key_size=4096
data_path="./letsencrypt"
email="estawhitework@gmail.com" # Укажите ваш email для получения уведомлений
staging=0 # Установите 1 для тестирования и 0 для рабочего режима

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

mkdir -p "$data_path"
mkdir -p "$data_path/conf/live/$domains"
mkdir -p "$data_path/www"

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$path"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:1024 -days 1 \
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo

echo "### Starting nginx with temporary configuration ..."
docker-compose up --force-recreate -d web
echo

echo "### Deleting dummy certificate for $domains ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo

echo "### Requesting Let's Encrypt certificate for $domains ..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

email_arg="--email $email"
if [ "$email" == "" ]; then
  email_arg="--register-unsafely-without-email"
fi

staging_arg=""
if [ $staging != "0" ]; then
  staging_arg="--staging"
fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

echo "### Stopping nginx ..."
docker-compose down

echo "### Starting nginx with SSL configuration ..."
docker-compose up --force-recreate -d web
