# Docker Project

![image](https://github.com/danielschmitz/docker-project/assets/1509692/8722381a-533e-4fca-a16b-85b6ac53687f)

Este projeto possui os seguintes containers:

| Container         | Descrição                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `db_postgres`     | Container PostgreSQL utilizado como banco de dados principal.                                         |
| `db_pgadmin`      | Container PGAdmin para gerenciamento visual do PostgreSQL.                                            |
| `db_migration`    | Container PostgreSQL utilizado para migração de dados com um script SQL inicial.                      |
| `web_api`         | Container Node.js que hospeda a API backend, utilizando Prisma para comunicação com o PostgreSQL.     |
| `web_mailcatcher` | Container MailCatcher para interceptar emails enviados pela aplicação em ambiente de desenvolvimento. |
| `web_swagger`     | Container Swagger UI para visualização da documentação da api                                         |
| `web_frontend`    | Aplicação simples que expoe o diretorio frontend ao ngix, sendo acessado pelo navegador               |

## Install

- instale o Docker em seu ambiente
- faça o clone deste projeto
- copie e cole o arquivo `.env.example` para `.env`
- execute `docker-compose up -d`

Você pode acessar:

- **pgAdmin**: http://localhost:8080 (login `admin@admin.com` e senha `admin`). A senha do banco de dados é `password`, conforme configurado no `.env`
- **api**: http://localhost:3000/posts
- **mailcatcher**: http://localhost:1080 interface web onde se recebe os emails "fake"
- **frontend**: http://localhost Simples Blog em html puro, lendo a api que por sua vez conecta no banco postgresql
- **swagger**: http://localhost:8081 interface web para visualizar a documentação da api

## Arquivos

- `.env.example`: contém a configuração do banco de dados e outras configurações. Você deve copiar este arquivo e renomea-lo para `.env`
- `docker-compose.yml`: configuração do docker-compose
- `backend/server.js`: o servidor node.js que expoé a API REST
- `backend/prisma/schema.prisma`: o esquema do banco de dados
- `pgsql.servers.json`: o arquivo de configuração do pgAdmin
- `migration/init.sql`: o arquivo de script de inicialização do banco de dados
- `backend/package.json`: o arquivo de configuração do backend
- `nginx.conf`: o arquivo de configuração do nginx. O nginx é o servidor web que expoe o diretorio frontend. Nessa configuração, é feito um proxy de localhost/api para localhost:3000
- `frontend/index.html`: o index do frontend, um simples arquivo index.html que usa bulma e jquery para ler os posts da api e mostrar na tela

## Futuro

A ideia deste projeto é ser um **start** para novos projetos, onde você poderá editar o backend e frontend.
