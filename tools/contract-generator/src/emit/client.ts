/**
 * Contract Skeleton Generator — operation client emitter (WI-07).
 *
 * Emits `<slug>/client.ts`: a client interface (one method per operation) and a factory that
 * binds the client to an INJECTED transport. Requests/responses are OPAQUE; the client only
 * resolves the deterministic path template + verb + parameters and delegates to `TransportPort`.
 * No host, protocol, serialization, auth, or business logic is emitted (all deferred).
 *
 * Traceability: GENERATOR-READINESS-GAP-REPORT.md §5(1) · CONTRACT-VALIDATION-ARCHITECTURE.md §5.
 */

import { generatedBanner } from "./render.ts";
import type { ContractView, OperationView } from "./view.ts";

function interfaceMethod(op: OperationView): string {
  return [
    `  /** ${op.verbSemantics} ${op.templatePath} — ${op.intent}. */`,
    `  ${op.operationId}(request: ${op.requestTypeName}): Promise<OpaquePayload>;`,
  ].join("\n");
}

function factoryMethod(op: OperationView): string {
  const sendFields: string[] = [
    `        operationId: ${JSON.stringify(op.operationId)},`,
    `        verbSemantics: ${JSON.stringify(op.verbSemantics)},`,
    `        path: ${op.pathExpression},`,
    `        pathParameters: ${op.pathParamsObject},`,
  ];
  if (op.queryParameters.length > 0) sendFields.push(`        queryParameters,`);
  if (op.hasBody) sendFields.push(`        body: request.body,`);

  const send = [`      return transport.send({`, ...sendFields, `      });`].join("\n");

  if (op.queryParameters.length > 0) {
    const queryAssign = op.queryParameters
      .map(
        (q) =>
          `      if (request.query?.${q} !== undefined) { queryParameters.${q} = request.query.${q}; }`,
      )
      .join("\n");
    return [
      `    ${op.operationId}(request) {`,
      `      const queryParameters: Record<string, string> = {};`,
      queryAssign,
      send,
      `    },`,
    ].join("\n");
  }
  return [`    ${op.operationId}(request) {`, send, `    },`].join("\n");
}

export function emitClient(view: ContractView): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const requestTypeNames = view.operations.map((op) => op.requestTypeName);
  const requestImport =
    requestTypeNames.length > 0
      ? `import type {\n${requestTypeNames.map((n) => `  ${n},`).join("\n")}\n} from "./requests.ts";\n`
      : "";

  const interfaceMethods = view.operations.map(interfaceMethod).join("\n");
  const factoryMethods = view.operations.map(factoryMethod).join("\n");

  return (
    generatedBanner([
      `Operation client for ${shortId} (${view.model.contract.title}).`,
      `Clients verdict: ${view.targets.clients} (skeleton; opaque payloads, injected transport).`,
    ]) +
    `import type { OpaquePayload, TransportPort } from "../_runtime/transport.ts";
${requestImport}
/** Client for ${shortId}. One method per operation; payloads are opaque (skeleton scope). */
export interface ${view.clientTypeName} {
${interfaceMethods}
}

/** Build a ${shortId} client bound to an injected transport (no host/protocol assumed). */
export function ${view.clientFactoryName}(transport: TransportPort): ${view.clientTypeName} {
  return {
${factoryMethods}
  };
}
`
  );
}
