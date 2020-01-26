const generateRepsonse = (
  ok: boolean,
  error: any | null,
  payload: object | null,
): object => {
  return { ok, error, payload };
};

export default generateRepsonse;
