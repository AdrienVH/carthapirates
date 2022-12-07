.PHONY: cleanDev watchDev startDev clean start

cleanDev:
		docker-compose -f docker-compose.dev.yml down --remove-orphans
		docker image prune -f
		docker volume prune -f

watchDev:
		docker-compose -f docker-compose.dev.yml up --build

startDev:
		docker-compose -f docker-compose.dev.yml up --build -d

clean:
		docker-compose down --remove-orphans
		docker image prune -f
		docker volume prune -f

start:
		docker-compose up --build -d