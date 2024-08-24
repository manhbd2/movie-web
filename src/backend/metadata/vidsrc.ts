import { IServer, IServerResponse, MetaRequest } from "./types/mw";
import { mwFetch } from "../helpers/fetch";

const baseURL: string = "http://localhost:3001/api";

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
