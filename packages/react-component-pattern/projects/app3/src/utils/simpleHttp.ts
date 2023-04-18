const fetchFactory =
  (method: string) =>
  <T>(url: string, opts?: unknown) =>
    fetch(url, {
      method: method.toUpperCase(),
      mode: 'cors',
      body: JSON.stringify(opts),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }).then((e) => e.json()) as Promise<T>;

export const simpleHttp = {
  get: fetchFactory('get'),
  post: fetchFactory('post'),
  put: fetchFactory('put'),
  patch: fetchFactory('patch'),
  delete: fetchFactory('delete'),
};
