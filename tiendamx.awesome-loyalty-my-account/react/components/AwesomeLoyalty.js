import React from "react";
import { useQuery } from "react-apollo";
import { pathOr } from "ramda";
import { Divider, Card } from "vtex.styleguide";

import PROFILE from "../graphql/getSession.graphql";
import DOCUMENTS from "../graphql/getDocuments.graphql";

import { documentSerializer } from "../utils/serializer";

const AwesomeLoyalty = () => {
  const { data: profileData } = useQuery(PROFILE);

  const { email } = pathOr([], ["profile"], profileData);

  const { data: documentData } = useQuery(DOCUMENTS, {
    variables: {
      schema: "awesome_loyalty_schema",
      fields: "email,balance,id",
      acronym: "awesome_loyalty",
      where: `email=${email}`,
    },
  });

  console.log(documentData);

  const balance = documentSerializer(pathOr([], ["documents"], documentData));

  if (balance.length > 0)
    return (
      <div>
        <h1>Awesome Loyalty</h1>
        <div
          style={{ padding: "80px", color: "#585959", background: "#fafafa" }}
        >
          <Card>
            <h2 className="mt0 mb6">User</h2>
            <p className="f6 gray ma0">
              <div className="f3 gray ma0">email: {balance[0].email}</div>
              <div className="f6 gray ma0">ID: {balance[0].id}</div>
            </p>
            <div className="mv6">
              <Divider orientation="horizontal" />
            </div>
            <h2 className="mt0 mb6">Balance</h2>
            <p className="f6 gray ma0">
              <div className="f1 gray ma0">$ {balance[0].balance}</div>
            </p>
          </Card>
        </div>
      </div>
    );

  return (
    <div style={{ padding: "80px", color: "#585959", background: "#fafafa" }}>
      <Card>
        <div className="flex">
          <div className="w-40">
            <h2 className="mt0 mb6">User</h2>
            <p className="f3 gray ma0">{email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AwesomeLoyalty;
