const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // need to see if this works???
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
            },
    },

    Mutation: {

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw AuthenticationError;
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw AuthenticationError;
            }
      
            const token = signToken(user);
      
            return { token, user };
          },

          addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },

          saveBook: async (parent, {
              bookId,
              authors,
              description,
              title,
              image,
              link
            }, context) => {
            console.log("checkpoint 1");
            console.log(context);
            console.log(context.user);
            // CONTEXT IS CURRENTLY RETURNING AS UNDEFINED - needs to return logged in user
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { 
                        savedBooks: {
                          bookId: bookId,
                          authors: authors,
                          description: description,
                          title: title,
                          image: image,
                          link: link
                        }
                      } 
                    },
                    { new: true, runValidators: true }
                );
                return user;
            }
            throw AuthenticationError;
          },

          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
              );
              return updatedUser;
            }
            throw AuthenticationError;
          },
          
    },
};


module.exports = resolvers;