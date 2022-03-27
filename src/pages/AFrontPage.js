import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import MainRoute from '../route/MainRoute'
import axios from 'axios'
import { authorization, baseUrl, formatNumber } from '../config/config'

export default class AFrontPage extends Component {
  constructor() {
    super()
    this.state = {
      username: "",
      password: "",
    }
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.handleAccess()
  }

  handleAccess() {
    if (localStorage.getItem('token')) {
      document.getElementById("login").className = "d-none";
      document.getElementById("dashboard").className = "d-block";

      const userRaw = localStorage.getItem('user')
      const role = JSON.parse(userRaw).role

      if(role === 'kasir'){
        document.getElementById("navUser").className = "d-none";
        document.getElementById("navPaket").className = "d-none";
      }else if(role === 'owner'){
        document.getElementById("navUser").className = "d-none";
        document.getElementById("navPaket").className = "d-none";
        document.getElementById("navMember").className = "d-none";
        document.getElementById("navKasir").className = "d-none";
      }else{
        // if admin
      }

    } else {
      document.getElementById("login").className = "d-block";
      document.getElementById("dashboard").className = "d-none";
    }
  }

  loginProcess(event) {
    event.preventDefault()
    let endpoint = "http://localhost:8000/api/auth"
    let request = {
      username: this.state.username,
      password: this.state.password
    }

    axios.post(endpoint, request, authorization)
      .then(result => {
        if (result.data.logged) {
          // store token in local storage
          localStorage.setItem("token", result.data.token)
          localStorage.setItem(
            "user", JSON.stringify(result.data.user)
          )
          window.alert("Congratulations, you're logged!")
          window.location.href = "/dashboard"
        } else {
          window.alert("Sorry, your username and password is incorrect, make sure you have the right one.")
        }
      })
      .catch(error => console.log(error))
  }

  componentDidMount() {
    this.handleAccess()
  }

  render() {
    return (
      <>
        {/* login section */}
        <div className='d-block' id="login">
          <div className="container">
            <div className="col-lg-6"
              style={{ margin: "18% auto" }}>
              <div className="card">
                <div className="card-header cp-main">
                  <h4 className="text-center text-white">Log In</h4>
                </div>
                <div className="card-body cp-soft">
                  <form onSubmit={ev => this.loginProcess(ev)}>
                    Username
                    <input type="text" className="form-control mb-2 bg-light"
                      required value={this.state.username}
                      onChange={ev => this.setState({ username: ev.target.value })}
                    />

                    Password
                    <input type="password" className="form-control mb-2 bg-light"
                      required value={this.state.password}
                      onChange={ev => this.setState({ password: ev.target.value })}
                    />

                    <button type="submit" className="btn mine btn-block mt-4">
                      Log In
                    </button>

                  </form >
                </div>
              </div>
            </div>
          </div >
        </div>

        {/* dashboard section */}
        <div className='d-none' id="dashboard">
          <div className="wrapper d-flex align-items-stretch">
            <nav id="sidebar">
              {/* <div className="custom-menu">
              <button type="button" id="sidebarCollapse" className="btn cs-main">
                <i className="fa fa-bars"></i>
                <span className="sr-only">Toggle Menu</span>
              </button>
            </div> */}
              <div className="p-4 pt-5 cp-main h-100">
                <h3>NayLaundry</h3>
                <ul className="list-unstyled components mb-5">
                  <li id='navDashboard'>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li id='navMember'>
                    <Link to="/member">Member</Link>
                  </li>
                  <li id='navPaket'>
                    <Link to="/paket">Paket</Link>
                  </li>
                  <li id='navUser'>
                    <Link to="/user">User</Link>
                  </li>
                  <li id='navTransaksi'>
                    <Link to="/transaksi">Transaksi</Link>
                  </li>
                  <li id='navKasir'>
                    <Link to="/kasir">Kasir</Link>
                  </li>
                  <li>
                    <Link to="/" onClick={() => this.logout()}>Logout</Link>
                  </li>
                </ul>

              </div>
            </nav>

            {/* <!-- Page Content  --> */}
            <div id="content" className="p-4 p-md-5 pt-5 cp-soft">
              <MainRoute />
            </div>
          </div>
        </div>
      </>
    )
  }
}

