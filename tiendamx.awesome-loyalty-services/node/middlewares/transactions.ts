import { json } from 'co-body'
import axios from "axios"

export async function transactions(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)
  const {
    vtex: {
      route: { params }
    }
  } = ctx

  const { id } = params

  const http = axios.create({
    headers: {
      VtexIdclientAutCookie: ctx.vtex.authToken,
      "REST-Range": `resources=0-1`,
      "Cache-Control": "no-cache",
      "X-Vtex-Use-Https": true
    }
  })

  const { data } = await http.get(
    `http://${ctx.vtex.account}.myvtex.com/api/dataentities/awesome_loyalty/documents/${id}?_fields=_all`
  )

  ctx.state.transactionData = data
  ctx.state.transactionData.transaction = body

  await next()
}
