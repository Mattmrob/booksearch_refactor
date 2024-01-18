const typeDefs = `
type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}

Auth {
    token: ID!
    user: User
}
`;

module.exports = typeDefs;