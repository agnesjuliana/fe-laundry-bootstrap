import React, { Component } from 'react'
import axios from 'axios'
import { Modal } from "bootstrap"
import { authorization, baseUrl, formatNumber } from '../config/config'

export default class PaketPage extends Component {
  constructor() {
    super()
    this.state = {
      pakets: [],
      id_paket: "",
      jenis_paket: "",
      harga: "",
      role: "",
      visible: true,
      action: ""
    }
    if (!localStorage.getItem("token")) {
      window.location.href = "/denied"
    } else {
      const userRaw = localStorage.getItem('user')
      const role = JSON.parse(userRaw).role.toLowerCase()

      if (role !== 'admin') {
        window.location.href = "/denied"
      }
    }
  }
  getData() {
    let endpoint = "http://localhost:8000/api/paket"
    axios.get(endpoint, authorization)
      .then(response => {
        this.setState({ pakets: response.data })
      })
      .catch(error => console.log(error))
  }
  tambahData() {
    //Memunculkan Modal
    this.modalPaket = new Modal(document.getElementById("tambah-modal"))
    this.modalPaket.show()

    //Mengosongkan input
    this.setState({
      id_paket: Math.random(1, 100), jenis_paket: "", harga: "", action: "tambah"
    })
  }
  ubahData(id_paket) {
    this.modalPaket = new Modal(document.getElementById("tambah-modal"))
    this.modalPaket.show()

    //mencari posisi index dari data member berdasarkan id_paket pada array members
    let index = this.state.pakets.findIndex(paket => paket.id_paket === id_paket)

    this.setState({
      id_paket: this.state.pakets[index].id_paket,
      jenis_paket: this.state.pakets[index].jenis_paket,
      harga: this.state.pakets[index].harga,
      action: "ubah"
    })
  }
  simpanData(ev) {
    ev.preventDefault() // untuk mencegah berjalannya aksi default dari form submit

    //Menghilangkan modal
    this.modalPaket.hide()

    //cek aksi tambah atau ubah
    if (this.state.action === "tambah") {
      let endpoint = "http://localhost:8000/api/paket"
      //Menampung data
      let newPaket = {
        id_paket: this.state.id_paket,
        jenis_paket: this.state.jenis_paket,
        harga: this.state.harga
      }
      axios.post(endpoint, newPaket, authorization)
        .then(response => {
          window.alert(response.data.message)
          this.getData()
        })
        .catch(error => console.log(error))
    } else if (this.state.action === "ubah") {
      this.modalPaket.hide()

      let endpoint = "http://localhost:8000/api/paket/" + this.state.id_paket
      let data = {
        id_paket: this.state.id_paket,
        jenis_paket: this.state.jenis_paket,
        harga: this.state.harga
      }
      axios.put(endpoint, data, authorization)
        .then(response => {
          window.alert(response.data.message)
          this.getData()
        })
        .catch(error => console.log(error))
    }
  }
  hapusData(id_paket) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      let endpoint = "http://localhost:8000/api/paket/" + id_paket

      axios.delete(endpoint, authorization)
        .then(response => {
          window.alert(response.data.message)
          this.getData()
        })
        .catch(error => console.log(error))
    }
  }
  componentDidMount() {
    this.getData()
    let user = JSON.parse(localStorage.getItem("user"))
    this.setState({ role: user.role })

    if (user.role === "Admin") {
      this.setState({ visible: true })
    } else {
      this.setState({ visible: false })
    }
  }
  render() {
    return (
      <div className="paket-page">
        <div className="main-content">
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h3 className="text-black pt-4">Data Paket</h3>
            <button class="btn mine" type="button" onClick={() => this.tambahData()}>Tambah Paket</button>
          </div>

          {/* tabel start */}
          <div className="card shadow table w-100">
            <table className="table table-striped">
              <thead className='cp-main'>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ID</th>
                  <th scope="col">Jenis Paket</th>
                  <th scope="col">Harga</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.pakets.map((paket, i) => (

                  <tr>
                    <th scope="row">{i + 1}</th>
                    <td>{paket.id_paket}</td>
                    <td>{paket.jenis_paket}</td>
                    <td>{paket.harga}</td>
                    <td>
                      <button className="btn btn-info btn-sm mt-1 mx-2" onClick={() => this.ubahData(paket.id_paket)}>Edit</button>
                      <button className="btn btn-danger btn-sm mt-1" onClick={() => this.hapusData(paket.id_paket)}>Hapus</button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
        <div className="modal fade" id="tambah-modal" tabindex="-1" aria-labelledby="tambah-modal-label" aria-hidden="true">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header cp-main">
                <h5 className="modal-title" id="tambah-modal-label">Form Data Paket</h5>
              </div>
              <div className="modal-body cp-soft">
                <form onSubmit={ev => this.simpanData(ev)}>
                  <div className="form-group">
                    <label>Jenis Paket</label>
                    <input type="text" className="form-control mb-2" value={this.state.jenis_paket} onChange={ev => this.setState({ jenis_paket: ev.target.value })} required></input>
                  </div>
                  <div className="form-group">
                    <label>Harga</label>
                    <input type="text" className="form-control mb-2" value={this.state.harga} onChange={ev => this.setState({ harga: ev.target.value })}></input>
                  </div>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5">
                    <button type="submit" className="btn btn-block mine">Simpan</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
