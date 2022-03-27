import React, { Component } from 'react'
import axios from 'axios'
import { authorization, baseUrl, formatNumber } from '../config/config'


export default class DashboardPage extends Component {
  constructor() {
    super()
    this.state = {
      jumlahPaket: 0,
      jumlahMember: 0,
      jumlahUser: 0,
      jumlahTranskasi: 0,
      income: 0,
    }
    if (!localStorage.getItem("token")) {
      window.location.href = "/denied"
    }
  }

  getSummary() {
    //Memanggil Member
    let endpoint = `${baseUrl}/member`
    axios.get(endpoint, authorization)
      .then(response => {
        this.setState({ jumlahMember: response.data.length })
      })
      .catch(error => console.log(error))

    //Memanggil Paket
    endpoint = `${baseUrl}/paket`
    axios.get(endpoint, authorization)
      .then(response => {
        this.setState({ jumlahPaket: response.data.length })
      })
      .catch(error => console.log(error))

    //Memanggil Transaksi
    endpoint = `${baseUrl}/transaksi`
    axios.get(endpoint, authorization)
      .then(response => {
        let dataTransaksi = response.data
        let income = 0
        for (let i = 0; i < dataTransaksi.length; i++) {
          let total = 0;
          for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
            let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
            let qty = dataTransaksi[i].detail_transaksi[j].qty

            total += (harga * qty)
          }
          income += total
        }
        this.setState({ jumlahTranskasi: response.data.length, income: income })
      })
      .catch(error => console.log(error))

    //Memanggil User
    endpoint = `${baseUrl}/users`
    axios.get(endpoint, authorization)
      .then(response => {
        this.setState({ jumlahUser: response.data.length })
      })
      .catch(error => console.log(error))
  }
  componentDidMount() {
    this.getSummary()
  }
  render() {
    return (
      <div className="main-content">
        <div className='row pl-3'>
          <h3>Welcome back, </h3>
        </div>
        <div className="row my-3">
          <div className="col-12">
            <div className="card cs-main shadow">
              <div className='card-body'>
                <div className='row p-3 justify-content-center'>
                  <div className='col-lg-4 col-md-6 label-card-left'>
                    <h6>Total Data</h6>
                    <h2>USER</h2>
                    <h1>{this.state.jumlahUser}</h1>
                    <p>This is real time data user</p>
                  </div>
                  <div className='col-lg-4 col-md-6 pl-5 label-card-left'>
                    <h6>Total Data</h6>
                    <h2>MEMBER</h2>
                    <h1>{this.state.jumlahMember}</h1>
                    <p>This is real time data member</p>
                  </div>
                  <div className='col-lg-4 col-md-6 pl-5'>
                    <h6>Total Data</h6>
                    <h2>PAKET</h2>
                    <h1>{this.state.jumlahPaket}</h1>
                    <p>This is real time data paket</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* transaksi income */}
        <div className='row'>
          <div className="col-lg-4 col-md-4 mb-2">
            <div className="card cs-dark shadow">
              <div className="card-body">
                <h4 className="card-title">Data Transaksi</h4>
                <h2>{this.state.jumlahTranskasi}</h2>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-md-8 mb-2">
            <div className="card cs-light shadow">
              <div className="card-body">
                <h4 className="card-title">Income</h4>
                <h2>Rp {formatNumber(this.state.income)}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
