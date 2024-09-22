# sudo kill $(sudo lsof -t -i:27017)
docker rm $(docker ps -a -q) -f > /dev/null 2>&1
docker rmi $(docker images -q) > /dev/null 2>&1
docker volume rm $(docker volume ls) > /dev/null 2>&1
docker system prune -af --volumes
docker network prune -f > /dev/null 2>&1
docker images
docker ps -a
docker volume ls
docker network ls