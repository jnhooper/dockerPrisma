import jwt from 'jsonwebtoken';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, {
  sequelize,
} from './models';

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(
        token,
        process.env.SECRET
      );
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.'
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  // resolvers: resolversT,
  formatError: error => {
    const message = error.message
      .replace(
        'SequelizeValidationError: ',
        ''
      )
      .replace(
        'Validation error: ',
        ''
      );

    return {
      ...error,
      message,
    };
  },
  context: async ({ req }) => {
    const me = await getMe(req);

    return {
      models,
      me,
      secret: process.env.SECRET,
    };
  },
});

const app = express();
server.applyMiddleware({ app });

const eraseDatabaseOnSync = true;

sequelize
  .sync({ force: eraseDatabaseOnSync })
  .then(async () => {
    if (eraseDatabaseOnSync) {
      console.log('CREATING USERS');
      createUserWidthMessages();
    }
    app.listen(
      {
        port: parseInt(
          process.env.SERVER_PORT
        ),
      },
      () =>
        console.log(
          `🚀 Server ready at http://localhost:${
            process.env.SERVER_PORT
          }${server.graphqlPath}`
        )
    );
  });

const createUserWidthMessages = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'password',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published something',
        },
      ],
    },
    {
      include: [models.Message],
    }
  );

  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'password',
      messages: [
        {
          text: 'Happy to release ...',
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};
