import fastify, {FastifyInstance} from "fastify";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";
import multer from "fastify-multer";

export const app: FastifyInstance = fastify({logger: true}).withTypeProvider<TypeBoxTypeProvider>();

export const upload = multer({storage: multer.memoryStorage()});
app.register(multer.contentParser)

// start the server
app.listen({port: 3000, host: '0.0.0.0'});