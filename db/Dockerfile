FROM mdillon/postgis
ENV POSTGRES_USER=myfirstuser
ENV POSTGRES_PASSWORD=myfirstpwd
ENV POSTGRES_DB=myfirstdb
COPY ./sql/postgis_01_init.sql /docker-entrypoint-initdb.d/