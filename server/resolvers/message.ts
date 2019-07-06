import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isMessageOwner } from './authorization';

export default {
  Query: {
    messages: async (parent, { offset = 0, limit = 100 }, { models }) =>
      await models.Message.findAll({
        offset,
        limit,
      }),
    message: async (parent, { id }, { models }) =>
      await models.Message.findByPk(id),
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) =>
        await models.Message.create({
          text,
          userId: me.id,
        })
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) =>
        await models.Message.destroy({
          where: { id },
        })
    ),
  },

  Message: {
    user: async (message, args, { models }) =>
      await models.User.findByPk(message.userId),
  },
};
