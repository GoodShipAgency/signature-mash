"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.app = void 0;
const fastify_1 = require("fastify");
const fastify_multer_1 = require("fastify-multer");
exports.app = (0, fastify_1.default)({ logger: true }).withTypeProvider();
exports.upload = (0, fastify_multer_1.default)({ storage: fastify_multer_1.default.memoryStorage() });
exports.app.register(fastify_multer_1.default.contentParser);
exports.app.listen({ port: 3000, host: '0.0.0.0' });
//# sourceMappingURL=app.js.map