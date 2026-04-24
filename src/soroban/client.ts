import { Server } from "soroban-client";
import { getSorobanConfig } from "./config";

let _client: Server | null = null;

export function getSorobanClient(): Server {
  if (_client) return _client;
  const { rpcUrl } = getSorobanConfig();
  _client = new Server(rpcUrl, { allowHttp: rpcUrl.startsWith("http://") });
  return _client;
}