import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
// Your component pages
import AwesomeLoyalty from './components/AwesomeLoyalty'

const MyAppPage = () => (
  <Fragment>
    <Route exact path="/awesome-loyalty" component={AwesomeLoyalty} />
  </Fragment>
)

export default MyAppPage
