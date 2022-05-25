import { ApolloServer } from 'apollo-server-micro';
import GraphQLSchema from '../../models/schemaBuilder';
import dbConnect from '../../utils/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';
import initMiddleware from '../../utils/init-middleware';
import Cors from 'cors';

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
    // Allow requests from any domain
    origin: '*',
    // Allow cookies to be shared
    credentials: true,
  })
);

const apolloServer = new ApolloServer({
  schema: GraphQLSchema,
  context: async ({
    req,
    res,
  }: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => {
    await dbConnect();
    const context = {};
    return context;
  },
});

const startServer = apolloServer.start();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  await startServer;

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
