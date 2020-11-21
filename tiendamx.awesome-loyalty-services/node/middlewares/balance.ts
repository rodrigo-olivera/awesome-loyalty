import axios from "axios"

export async function balance(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params }
    }
  } = ctx

  const { id } = params

  console.log(id)

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

  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const response = {
    id: data.id,
    balance: data.balance,
    totalBalance: data.balance,
    emissionDate: data.createdIn,
    expiringDate: `${nextWeek.toISOString()}`,
    provider: `awesome_loyalty`,
    discount: true,
    transaction: {
      href: `${ctx.vtex.account}/giftcardproviders/awesome_loyalty`,
    },
  };

  console.log(response)

  ctx.status = 200
  ctx.body = response
  ctx.set('Cache-Control', 'no-cache')

  await next()
}
