import { conf } from "@/setup/config";

import {
  IServer,
  IServerResponse,
  ISourceResponse,
  ISources,
  MetaRequest,
} from "./types/mw";
import { mwFetch } from "../helpers/fetch";

const baseURL: string = conf().VITE_SERVICE_URL;

const headers = {
  accept: "application/json",
};

async function get<T>(url: string, params?: object): Promise<T> {
  const res = await mwFetch<any>(encodeURI(url), {
    headers,
    baseURL,
    params: {
      ...params,
    },
  });
  return res;
}

export async function getServers(request: MetaRequest): Promise<IServer[]> {
  const { id, type } = request;
  const data = await get<IServerResponse>(`/${id}/servers?type=${type}`);
  return data.data;
}

export async function getSources(hash: string): Promise<ISources> {
  const data = await get<ISourceResponse>(`/source/${hash}`);
  return data.data;
}
