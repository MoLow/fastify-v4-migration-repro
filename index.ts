import fastify from "fastify";
import { Type } from "@sinclair/typebox";

const app = fastify({ logger: { level: 'info', transport: { target: "pino-pretty", options: { colorize: true } } } });

const DatumBase = Type.Object({ _id: Type.String() });
const Datum = Type.Intersect([DatumBase, Type.Union([
  Type.Object({ type: Type.Literal('A'), a: Type.String() }),
  Type.Object({ type: Type.Literal('B'), b: Type.String() }),
])]);

app.register(async (instance) => {
  instance.get('/', {
    schema: {
      response: {
        200: Type.Object({
          success: Type.Literal(true),
          data: Type.Array(Datum)
        }),
      },
    },
  },
  async (request, reply) => {
    return reply.status(200).send({ success: true, data: [{ _id: '1', type: 'A', a: 'a' }] })
  });
});

app.listen(3000);