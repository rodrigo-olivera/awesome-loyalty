import React, { FC } from 'react'
import { useQuery } from "react-apollo";
import { pathOr } from "ramda";
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader, Table, ButtonWithIcon, IconEdit } from 'vtex.styleguide'
import { Link } from 'vtex.render-runtime'

import DOCUMENTS from "./graphql/getDocuments.graphql";
import { documentSerializer } from "./utils/serializer";

import './styles.global.css'

const AwesomeLoyalty: FC = () => {

  const { data: documentsData } = useQuery(DOCUMENTS, {
    variables: {
      acronym: "awesome_loyalty",
      schema: "awesome_loyalty_schema",
      fields: "email,balance,id"
    },
    fetchPolicy: "no-cache",
  });

  const balance = documentSerializer(pathOr([], ["documents"], documentsData));

  console.log(balance)

  const jsonschema = {
    properties: {
      id: {
        title: 'ID',
        width: 300,
      },
      email: {
        title: 'Email',
        width: 300,
      },
      balance: {
        title: 'Balance',
        width: 150,
        cellRenderer: ({ cellData, rowData }) => {
          return parseFloat(cellData).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })
        }
      },
      actions: {
        title: 'Actions',
        cellRenderer: ({ cellData, rowData }) => {
          return (
            <div className="flex">
              <div className="mr2">
                <Link to={`/admin/app/awesome-loyalty/${rowData.id}`} className='c-on-base f5 ml-auto db no-underline pv4 ph5'>
                  <ButtonWithIcon icon={<IconEdit />} variation="tertiary" />
                </Link>
              </div>
            </div>
          )
        },
      }
    },
  }
  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="awesome-loyalty.navigation.label-table-title" />}
        />
      }
    >
      <PageBlock variation="full">
        <Table
          schema={jsonschema}
          items={balance}
          toolbar={{
            inputSearch: {
              placeholder: 'Search stuff...',
            },
            newLine: {
              label: 'New',
              handleCallback: () => alert('handle new line callback'),
            },
          }}
        />
      </PageBlock>
    </Layout>
  )
}

export default AwesomeLoyalty
