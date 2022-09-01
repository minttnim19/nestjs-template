# Init NestJS as a Service

Node.js framework [NestJS](https://github.com/nestjs/nest) project structure and used is TypeScript
> Folder structure you can see in [Confluence](https://ascendcommerce.atlassian.net/l/c/YCNQqTP6)

## Run the docker for development:

You can now build, create, start, and attach to containers to the environment for your application. To build the
containers use following command inside the project root:

```sh
$ docker-compose build
```

To start the application and run the containers in the background, use following command inside project root:

```sh
$ docker-compose up -d
# Or
$ docker-compose up -d --build
```

## Map the domain

Open the hosts file on your local machine `/etc/hosts`.

```sh
127.0.0.1  egg-core-bs.eggsmartpos.local
```

Run [http://example.eggsmartpos.local:3000](http://example.eggsmartpos.local:3000)

## Watch debug process

```sh
$ docker logs -f example
```