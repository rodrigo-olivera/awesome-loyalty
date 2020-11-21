import { json } from 'co-body'
import axios from "axios"

export async function search(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)

  const { client: { email } } = body

  console.log(email)

  const http = axios.create({
    headers: {
      VtexIdclientAutCookie: ctx.vtex.authToken,
      "REST-Range": `resources=0-1`,
      "Cache-Control": "no-cache",
      "X-Vtex-Use-Https": true
    }
  })

  const { data } = await http.get(
    `http://${ctx.vtex.account}.myvtex.com/api/dataentities/awesome_loyalty/search?_schema=awesome_loyalty_schema&_fields=_all&email=${email}`
  )

  const response = [
    {
      id: `${data[0].id}`,
      provider: `awesome_loyalty`,
      balance: data[0].balance,
      totalBalance: data[0].balance,
      groupName: `Awesome Loyalty`,
      _self: {
        href: `${ctx.vtex.account}/giftcardproviders/awesome_loyalty`,
      },
    }
  ]

  console.log(response)

  ctx.status = 200
  ctx.body = response
  ctx.set('Cache-Control', 'no-cache')

  await next()
}
