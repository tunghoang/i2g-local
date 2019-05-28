docker build -t $1 .
docker push $1
docker rmi $1
