import 'reflect-metadata'
import * as tq from 'type-graphql'
import { ApolloServer } from 'apollo-server'
import { resolvers } from "@generated/type-graphql";
import { AuthResolver } from './resolvers/AuthResolver';
import { isAuth } from './isAuth';
import { stitchSchemas } from '@graphql-tools/stitch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const corsOptions = {
  origin: ["http://localhost:3000", "https://studio.apollographql.com"]
}

const app = async () => {
  const CrudSchema = await tq.buildSchema({resolvers:resolvers, globalMiddlewares: [isAuth]})

  const AuthSchema = await tq.buildSchema({resolvers:[AuthResolver]})

  const gatewaySchema = stitchSchemas({
    subschemas: [
      CrudSchema,
      AuthSchema,
    ]
  });

  new ApolloServer({ schema: gatewaySchema, context: ({req, res}) => ({req, res, prisma: prisma}), cors: corsOptions }).listen({ port: 4000 }, () =>
    console.log('🚀 Server ready at: http://localhost:4000')
  )
}

app()