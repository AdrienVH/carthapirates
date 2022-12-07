FROM pgrouting/pgrouting
ENV POSTGRES_USER=myfirstuser
ENV POSTGRES_PASSWORD=myfirstpwd
ENV POSTGRES_DB=myfirstdb
COPY ./sql/postgis_00_extensions.sql /docker-entrypoint-initdb.d/
COPY ./sql/postgis_01_routes.sql /docker-entrypoint-initdb.d/
COPY ./sql/postgis_02_init.sql /docker-entrypoint-initdb.d/
COPY ./sql/postgis_03_traitements.sql /docker-entrypoint-initdb.d/