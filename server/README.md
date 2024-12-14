# API Gestión de Recetas Médicas

Esta es una API RESTful construida con NestJS para gestionar recetas médicas, medicamentos, notificaciones y usuarios. Permite la creación y gestión de recetas, asociando medicamentos a cada receta, y notificaciones para pacientes, con operaciones CRUD y control de acceso basado en roles de usuario.

## Tabla de Contenidos

- [API Gestión de Recetas Médicas](#api-gestión-de-recetas-médicas)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características](#características)
  - [Instalación](#instalación)
    - [Requisitos Previos](#requisitos-previos)
    - [Clonar el Repositorio](#clonar-el-repositorio)
    - [Instalación de Dependencias](#instalación-de-dependencias)
    - [Configuración de las variables de entorno](#configuración-de-las-variables-de-entorno)
    - [Crea las migraciones a la Base de Datos](#crea-las-migraciones-a-la-base-de-datos)
  - [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
  - [Tecnologías Usadas](#tecnologías-usadas)

- **Gestión de Usuarios**: Permite la creación, actualización y eliminación de usuarios, con control de acceso basado en roles (Administrador, Médico, Paciente, Farmacéutico).
- **Gestión de Recetas**: Los médicos pueden crear recetas asociadas a pacientes, con detalles de los medicamentos recomendados.
- **Medicamentos**: Permite la creación y actualización de medicamentos disponibles en la farmacia, con control de stock.
- **Notificaciones**: El sistema puede enviar notificaciones a los pacientes sobre el estado de sus recetas.
- **Roles de Usuario**: Control de acceso a las funcionalidades del sistema basado en roles, permitiendo a los administradores gestionar usuarios, médicos gestionar recetas y pacientes consultar sus recetas.

## Instalación

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu sistema:

- [Node.js](https://nodejs.org/en/) (versión 14 o superior)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [MySQL](https://www.mysql.com/)
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli)

### Clonar el Repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/Dalus04/FarmaHelper.git
cd FarmaHelper
cd server
```

### Instalación de Dependencias

Instala las dependencias necesarias usando npm:

```bash
npm install
```

### Configuración de las variables de entorno

Crea las siguientes variables de entorno en un archivo `.env`:

```
// Ejemplo aqui: https://www.prisma.io/docs/orm/overview/databases/mysql#connection-url
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

SECRET_KEY=<you-secret-key>

JWT_SECRET=<you-secret-key>

// Generate your token: https://apiperu.dev/
API_PERU_DEV=<your_api_token>

// Backend Server
BACKEND_SERVER=http://localhost:8000

// Cliente
CLIENT_SERVER=http://localhost:5173

// Correos
EMAIL_HOST=smtp.gmail.com
EMAIL_AUTH_USER=<your-email>
EMAIL_AUTH_PASSWORD=<your-app-password>
```

### Crea las migraciones a la Base de Datos

Ejecuta el siguiente comando para crear las migraciones:

```bash
npx prisma migrate dev --name Initial
```

## Ejecución de la Aplicación   

Para ejecutar la aplicación en modo de desarrollo, utiliza el siguiente comando:

```bash
npm run start:dev
```

La documentación de la aplicación estará disponible en `http://localhost:8000/api/docs`.

## Tecnologías Usadas

- **NestJS**: Framework para Node.js basado en TypeScript.
- **TypeScript**: Lenguaje de programación usado para el desarrollo.
- **Prisma**: ORM para la gestión de la base de datos.
- **MySQL**: Base de datos relacional utilizada para almacenar datos.
- **JWT**: Para autenticación basada en tokens.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
