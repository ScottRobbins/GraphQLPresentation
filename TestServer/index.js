const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// Some fake data
const books = [
  {
    "id": 1,
    "title": "A SwiftUI Kickstart",
    "author": {
      "id": 1,
      "name": "Daniel Steinberg",
      "age": 21
    }
  },
  {
    "id": 2,
    "title": "Swift in 24 Hours",
    "author": {
      "id": 2,
      "name": "BJ Miller",
      "age": 21
    }
  }
];

// The GraphQL schema in string form
const typeDefs = `
type Query {
  books: [Book]!
}

type Book {
  id: ID
  title: String!
  author: Author
}   

type Author {
  id: ID
  name: String! 
  age: Int
  books: [Book]!
}
`;

// The resolvers
const resolvers = {
  Query: { books: () => {
      console.log('requested to the network')
      return books
   }},
   Author: { books: (obj, args, context, info) => {
      console.log('getting books from author')
      console.log(obj)
      return books.filter( book => book.author.id === obj.id )
     }
   }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});