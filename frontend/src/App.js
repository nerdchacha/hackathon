import React from 'react';
import { Route } from 'react-router-dom'

import Header from './components/Header'
import Login from './components/Login'
import List from './components/List'
import NoAccess from './components/NoAccess'

const App = () => (
  <div>
    <Header />
    <main>
      <Route exact path="/" component={Login} />
      <Route exact path="/list" component={List} />
      <Route exact path="/no-access" component={NoAccess} />
    </main>
  </div>
)

export default App