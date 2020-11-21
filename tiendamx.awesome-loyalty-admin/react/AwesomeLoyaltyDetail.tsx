import React, { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useQuery, useMutation } from "react-apollo";
import { pathOr } from "ramda";
import { Layout, PageBlock, PageHeader, Input, ButtonWithIcon, Spinner } from 'vtex.styleguide'
import { Link } from 'vtex.render-runtime'

import DOCUMENTS from "./graphql/getDocuments.graphql";
import UPDATE_DOCUMENTS from "./graphql/updateDocument.graphql";

import { documentSerializer } from "./utils/serializer";

import './styles.global.css'

interface Props {
  params: {
    id: string
  }
}

const AwesomeLoyaltyDetail: FC<Props> = ({ params: { id } }) => {

  const { data: documentsData, loading } = useQuery(DOCUMENTS, {
    variables: {
      acronym: "awesome_loyalty",
      schema: "awesome_loyalty_schema",
      fields: "email,balance,id",
      where: `id=${id}`
    },
    fetchPolicy: "no-cache",
  });

  const balance = documentSerializer(pathOr([], ["documents"], documentsData))[0];

  const [updateDocument] = useMutation(UPDATE_DOCUMENTS)

  const [value, setValue] = useState(0)

  const [reload, setReload] = useState(false)

  const save = () => {

    setReload(true)

    updateDocument({
      variables: {
        acronym: 'awesome_loyalty',
        document: {
          fields: [
            { key: 'id', value: balance.id },
            { key: 'email', value: balance.email },
            { key: 'balance', value: Number(value).toFixed(2) },
            { key: 'schemas', value: "awesome_loyalty_schema" },
          ],
        },
      },
    })

    location.reload()
  }

  return (
    <Layout
      pageHeader={
        <PageHeader
          linkLabel={<Link to='/admin/app/awesome-loyalty' className='c-on-base f5 ml-auto db no-underline pv4 ph5'>Return</Link>}
        />
      }
    >
      <PageBlock variation="full">
        {loading ? <Spinner /> :
          <div>
            <h4 className="t-heading-4 mt0"> Balance Detail </h4>

            <div className="mb5">
              <Input label="ID" value={balance.id} disabled />
            </div>

            <div className="mb5">
              <Input label="Email" value={balance.email} disabled />
            </div>

            <div className="mb5">
              <Input value={value ? value : balance.balance} label="Balance" prefix={"$"} onChange={(e) => setValue(e.target.value)} disabled={reload} />
            </div>

            <ButtonWithIcon variation="primary" onClick={save} isLoading={reload}>Save</ButtonWithIcon>
          </div>
        }
      </PageBlock>
    </Layout>
  )
}

export default AwesomeLoyaltyDetail
