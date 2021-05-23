import React, { useEffect } from 'react'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import queryString from 'query-string';

import { AUTH_SERVICE_URL } from '../../constants'

import './style.scss'

import { LOCALSTORAGE_KEY } from '../../constants'

const Login = (props) => {
  useEffect(() => {
    const { accessToken } = queryString.parse(props.location.search);
    if (accessToken) { localStorage.setItem(LOCALSTORAGE_KEY, accessToken); }
    const savedAccessToken = localStorage.getItem(LOCALSTORAGE_KEY);
    if (savedAccessToken) { props.push('/list') }
  })
  return (
    <div className="login-page">
      <div className="card-container">
        <div className="card">
          <a className="btn btn-primary" href={`${AUTH_SERVICE_URL}/auth/atlassian`}>Login using JIRA as client</a>
          <a className="btn btn-primary" href={`${AUTH_SERVICE_URL}/auth/atlassian`}>Login using JIRA as employee</a>
        </div>
      </div>
    </div>
  )
}
const mapDispatchToProps = (dispatch) => ({
  push: (path) => dispatch(push(path))
})

export default connect(null, mapDispatchToProps)(Login)