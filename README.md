# dockerNodeGraphQl
This is a repo of boilerplate with the basics setup for docker, node and graphql.
It has hot reloading on the front end and automatic server restarts on the backend
thanks to nodemon

### Server
run `docker-compose up` and navigate to localhost:3000/graphql

*note: you will likely want to change the postgres container_name to be something project specific
### Client
run `docker-compose exec web npm run start:client` and navigate to localhost:8080
### Add packages
run `docker-compose exec web yarn add <package name> after you have already ran `docker-compose up`.

alternatively you could just run `docker-compose run web yarn add .....`

### killing docker
run `docker-compose down`

### useful site for docker commands
https://zaiste.net/removing_docker_containers/

### created following 
https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-registration-sign-up-authentication
