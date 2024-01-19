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

          saveBook: async (parent, args, context) => {
            console.log("checkpoint 1");
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { 
                        savedBooks: {
                          bookId: args.bookId,
                          authors: args.authors,
                          description: args.description,
                          title: args.title,
                          image: args.image,
                          link: args.link
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