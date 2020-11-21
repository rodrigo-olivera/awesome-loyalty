import axios from "axios"

export async function transactions_update(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params }
    }
  } = ctx

  const { id } = params

  const balance = ctx.state.transactionData.balance - ctx.state.transactionData.transaction.value

  console.log(balance)

  const http = axios.create({
    headers: {
      VtexIdclientAutCookie: ctx.vtex.authToken,
      "REST-Range": `resources=0-1`,
      "Cache-Control": "no-cache",
      "X-Vtex-Use-Https": true
    }
  })

  const { data } = await http.patch(
    `http://${ctx.vtex.account}.myvtex.com/api/dataentities/awesome_loyalty/documents/${id}`,
    { balance }
  );

  console.log(data)

  ctx.status = 200
  ctx.body = { balance }
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Content-Type', 'application/json')

  await next()
}
