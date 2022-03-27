import React, { Component } from 'react'
import domToPdf from "dom-to-pdf"
import axios from "axios";
import { authorization, baseUrl, formatNumber } from '../config/config'

export default class TransaksiPage extends Component {
  constructor() {
    super()
    this.state = {
      transaksi: [],
      visible: true,
    }
    if (!localStorage.getItem("token")) {
      window.location.href = "/login"
    }
  }

  getData() {
    let endpoint = `${baseUrl}/transaksi`
    axios.get(endpoint, authorization)
      .then(response => {
        let dataTransaksi = response.data
        for (let i = 0; i < dataTransaksi.length; i++) {
          let total = 0;
          for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
            let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
            let qty = dataTransaksi[i].detail_transaksi[j].qty

            total += (harga * qty)
          }

          // tambahkan key "total"
          dataTransaksi[i].total = total
        }

        this.setState({ transaksi: dataTransaksi })
        console.log(response.data)
      })
      .catch(error => console.log(error))
  }

  componentDidMount() {
    this.getData()

    let user = JSON.parse(localStorage.getItem("user"))
    // Cara kedua
    if (user.role === 'Admin' || user.role === 'Kasir') {
      this.setState({
        visible: true
      })
    } else (
      this.setState({
        visible: false
      })
    )
  }

  HapusTransaksi(id_transaksi) {
    if (window.confirm("Apakah anda yakin ingin menghapus transaksi ini ?")) {
      let endpoint = `${baseUrl}/transaksi/${id_transaksi}`

      axios.delete(endpoint, authorization)
        .then(response => {
          window.alert(response.data.message)
          this.getData()
        })
        .catch(error => console.log(error))
    }
  }

  convertStatus(id_transaksi, status) {
    if (status === 1) {
      return (
        <div className="badge bg-info">
          Transaksi Baru
          <br />

          <a classname="" onClick={() => this.changeStatus(id_transaksi, 2)}><i className="fa-solid fa-angles-right mx-2"></i></a>
        </div>
      )
    } else if (status === 2) {
      return (
        <div className="badge bg-warning">
          Sedang diproses
          <br />

          <a classname="" onClick={() => this.changeStatus(id_transaksi, 3)}><i className="fa-solid fa-angles-right mx-2"></i></a>
        </div>
      )
    } else if (status === 3) {
      return (
        <div className="badge bg-primary">
          Siap diambil
          <br />

          <a classname="" onClick={() => this.changeStatus(id_transaksi, 4)}><i className="fa-solid fa-angles-right mx-2"></i></a>
        </div>
      )
    } else if (status === 4) {
      return (
        <div className="badge bg-success">
          Telah diambil
        </div>
      )
    }
  }

  changeStatus(id, status) {
    if (window.confirm('Apakah Anda yakin ingin mengganti status transaksi ini?')) {
      let endpoint = `${baseUrl}/transaksi/status/${id}`
      let data = {
        status: status
      }

      axios.post(endpoint, data, authorization)
        .then(response => {
          window.alert(`Status telah diubah`)
          this.getData()
        })
        .catch(error => console.log(error))
    }
  }

  convertStatusBayar(id_transaksi, dibayar) {
    if (dibayar === 0) {
      return (
        <div className="badge bg-danger text-white">
          Belum Dibayar
          <br />

          <a className="text-primary"
            onClick={() => this.changeStatusBayar(id_transaksi, 1)}><i className="fa-solid fa-angles-right mx-2"></i></a>

        </div>
      )
    } else if (dibayar === 1) {
      return (
        <div className="badge bg-success text-white">
          Sudah Dibayar
        </div>
      )
    }
  }

  changeStatusBayar(id, status) {
    if (window.confirm('Apakah anda yakin ingin mengubah status pembayaran ini?')) {
      let endpoint = `${baseUrl}/transaksi/bayar/${id}`
      axios.get(endpoint, authorization)
        .then(response => {
          window.alert('Status pembayaran telah diubah')
          this.getData()
        })
        .catch(error => console.log(error))
    }
  }

  convertPdf() {
    // ambil elemt yang akan di convert ke pdf
    let element = document.getElementById(`target`)
    let options = {
      filename: "Report.pdf"
    }

    domToPdf(element, options, () => {
      window.alert("File will be downloaded soon")
    })
  }

  printStruk(id) {
    var element = document.getElementById(`struk${id}`);
    var options = {
      filename: `struk-${id}.pdf`
    };
    domToPdf(element, options, function (pdf) {
      window.alert(`Struk will download soon`)
    });
  }

  render() {
    const target = React.createRef()
    const optionPDF = {
      orientation: `landscape`,
      unit: `cm`,
      format: [21, 29.7],
    }
    return (
      <div className="container">
        <div className="card">
          <div className="card-header cp-main">
            <h4 className="text-white">
              List Transaksi
            </h4>
          </div>

          <div className="card-body">
            <button className="btn mine mb-3"
              onClick={() => this.convertPdf()}>
              Convert to PDF
            </button>

            <div ref={target} id="target">
              <ul className="list-group">
                {this.state.transaksi.map(trans => (
                  <li className="list-group-item">
                    <div className="row">
                      {/** Member area */}
                      <div className="col-lg-3">
                        <small className="text-info">
                          Member
                        </small><br />
                        {trans.member.nama}
                      </div>

                      {/** Tanggal Transaksi area */}
                      <div className="col-lg-3">
                        <small className="text-info">
                          Tanggal Transaki
                        </small><br />
                        {trans.tgl}
                      </div>

                      {/** Batas Waktu area */}
                      <div className="col-lg-3">
                        <small className="text-info">
                          Batas Waktu
                        </small><br />
                        {trans.batas_waktu}
                      </div>

                      {/** Tanggal Bayar area */}
                      <div className="col-lg-3">
                        <small className="text-info">
                          Tanggal Bayar
                        </small><br />
                        {trans.tgl_bayar}
                      </div>

                      {/** Status area */}
                      <div className="col-lg-3">
                        <small className="text-info">
                          Status
                        </small><br />
                        {this.convertStatus(trans.id_transaksi, trans.status)}
                      </div>

                      {/** Struk area */}
                      <div className="col-lg-3">
                        <small className="text-info">
                          Struk
                        </small><br />
                        <button className="btn cs-main btn-sm"
                          onClick={() => this.printStruk(trans.id_transaksi)}>
                          Struk PDF
                        </button>
                      </div>

                      <div style={{ display: `none` }}>
                        <div className="col-lg-12 p-3"
                          id={`struk${trans.id_transaksi}`}>
                          <h3 className="text-info text-center">
                            Root Laundry
                          </h3>
                          <h5 className="text-center">
                            Jalan Danau Ranau II G2C No. 30 Sawojajar Malang
                            <br />
                            Telp. 0980-9834-6473 | IG: @root_laundry
                          </h5>

                          <h4 className="text-info">Member: {trans.member.nama}</h4>
                          <h4 className="text-info">Tgl: {trans.tgl}</h4>

                          <div className="row mt-3"
                            style={{ borderBottom: `1px dotted black` }}>
                            <div className="col-4">
                              <h5>Paket</h5>
                            </div>
                            <div className="col-2">
                              <h5>Qty</h5>
                            </div>
                            <div className="col-3">
                              <h5>Harga Satuan</h5>
                            </div>
                            <div className="col-3">
                              <h5>Total</h5>
                            </div>
                          </div>

                          {trans.detail_transaksi.map(item => (
                            <>
                              <div className="row mt-3"
                                style={{ borderBottom: `1px dotted black` }}>
                                <div className="col-4">
                                  <h5>{item.paket.jenis_paket}</h5>
                                </div>
                                <div className="col-2">
                                  <h5>{item.qty}</h5>
                                </div>
                                <div className="col-3">
                                  <h5>Rp {item.paket.harga}</h5>
                                </div>
                                <div className="col-3">
                                  <h5>Rp {item.paket.harga * item.qty}</h5>
                                </div>
                              </div>
                            </>
                          ))}
                          <div className="row mt-2">
                            <div className="col-9"></div>
                            <div className="col-3">
                              <h5>Rp {trans.total}</h5>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/** Status Pembayaran area */}
                      <div className="col-lg-3">
                        <small className="text-info">
                          Status Pembayaran
                        </small><br />
                        {this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}
                      </div>

                      {/* this is total area */}
                      <div className="col-lg-3">
                        <small className="text-info">
                          Total
                        </small><br />
                        Rp {formatNumber(trans.total)}
                      </div>

                      {/* DELETE BUTTON */}
                      <div className="col-lg-3">
                        <small className="text-info">
                          Option
                        </small><br />
                        <button className={`btn btn-sm btn-danger ${this.state.visible ? `` : `d-none`}`}
                          onClick={() => this.HapusTransaksi(trans.id_transaksi)}>
                          Delete
                        </button>
                      </div>
                    </div>

                    <hr />

                    {/** Area Detail Transaksi */}
                    <h5>Detail Transaksi</h5>
                    {trans.detail_transaksi.map(detail => (
                      <div className="row">
                        {/** area Nama Paket */}
                        <div className="col-lg-3">
                          {detail.paket.jenis_paket}
                        </div>
                        {/** area Quantity */}
                        <div className="col-lg-2">
                          Qty :  {detail.qty}
                        </div>
                        {/** area Harga Paket */}
                        <div className="col-lg-3">
                          @ Rp {formatNumber(detail.paket.harga)}
                        </div>
                        {/** area Harga Total */}
                        <div className="col-lg-4">
                          Total Rp {detail.paket.harga * detail.qty}
                        </div>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
