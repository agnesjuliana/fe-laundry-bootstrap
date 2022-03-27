import React, { Component } from 'react'
import axios from 'axios'
import { Modal } from "bootstrap"
import { authorization, baseUrl, formatNumber } from '../config/config'


export default class MemberPage extends Component {
  constructor() {
    super()
    this.state = {
      members: [],
      id_member: "",
      nama: "",
      alamat: "",
      telepon: "",
      jenis_kelamin: "",
      action: "" //untuk menyimpan aksi dari tambah atau ubah data
    }

    if (!localStorage.getItem("token")) {
      window.location.href = "/denied"
    } else {
      const userRaw = localStorage.getItem('user')
      const role = JSON.parse(userRaw).role.toLowerCase()

      if (role !== 'admin' && role !== 'kasir') {
        window.location.href = "/denied"
      }
    }
  }
  getData() {
    let endpoint = `${baseUrl}/member`
    axios.get(endpoint, authorization)
      .then(response => {
        this.setState({ members: response.data })
      })
      .catch(error => console.log(error))
  }
  tambahData() {
    //Memunculkan Modal
    this.modalMember = new Modal(document.getElementById("tambah-modal"))
    this.modalMember.show()

    //Mengosongkan input
    this.setState({
      id_member: Math.random(1, 10000),
      nama: "",
      jenis_kelamin: "Pria",
      alamat: "",
      telepon: "",
      action: "tambah"
    })
  }
  ubahData(id_member) {
    this.modalMember = new Modal(document.getElementById("tambah-modal"))
    this.modalMember.show()

    //mencari posisi index dari data member berdasarkan id_member pada array members
    let index = this.state.members.findIndex(member => member.id_member === id_member)

    this.setState({
      id_member: this.state.members[index].id_member,
      nama: this.state.members[index].nama,
      alamat: this.state.members[index].alamat,
      telepon: this.state.members[index].telepon,
      jenis_kelamin: this.state.members[index].jenis_kelamin,
      action: "ubah"
    })
  }
  simpanData(ev) {
    ev.preventDefault() // untuk mencegah berjalannya aksi default dari form submit
    this.modalMember.hide()

    if (this.state.action === "tambah") {
      let endpoint = `${baseUrl}/member/`
      let newMember = {
        id_member: this.state.id_member,
        nama: this.state.nama,
        alamat: this.state.alamat,
        telepon: this.state.telepon,
        jenis_kelamin: this.state.jenis_kelamin
      }
      axios.post(endpoint, newMember, authorization)
        .then(response => {
          window.alert(response.data.message)
          this.getData()
        })
        .catch(error => console.log(error))

    } else if (this.state.action === "ubah") {
      this.modalMember.hide()

      let endpoint = `${baseUrl}/member/` + this.state.id_member
      let data = {
        id_member: this.state.id_member,
        nama: this.state.nama,
        alamat: this.state.alamat,
        telepon: this.state.telepon,
        jenis_kelamin: this.state.jenis_kelamin
      }
      axios.put(endpoint, data, authorization)
        .then(response => {
          window.alert(response.data.message)
          this.getData()
        })
        .catch(error => console.log(error))
    }
  }
  hapusData(id_member) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      let endpoint = `${baseUrl}/member/${id_member}`

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
  }
  render() {
    return (
      <div className="member-page">
        <div className="main-content">
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h3 className="text-black pt-4">Data Member</h3>
            <button class="btn mine" type="button" onClick={() => this.tambahData()}>Tambah Member</button>
          </div>

          {/* tabel start */}
          <div className="card shadow table w-100">
            <table className="table table-striped">
              <thead className='cp-main'>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ID</th>
                  <th scope="col">Nama</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Telpon</th>
                  <th scope="col">Alamat</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.members.map((member, i) => (

                  <tr>
                    <th scope="row">{i + 1}</th>
                    <td>{member.id_member}</td>
                    <td>{member.nama}</td>
                    <td>{member.jenis_kelamin}</td>
                    <td>{member.telepon}</td>
                    <td>{member.alamat}</td>
                    <td>
                      <button className="btn btn-info btn-sm mt-1 mx-2" onClick={() => this.ubahData(member.id_member)}>Edit</button>
                      <button className="btn btn-danger btn-sm mt-1" onClick={() => this.hapusData(member.id_member)}>Hapus</button>
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
                <h5 className="modal-title" id="tambah-modal-label">Form Data Member</h5>
              </div>
              <div className="modal-body cp-soft">
                <form onSubmit={ev => this.simpanData(ev)}>
                  <div className="form-group">
                    <label>Nama</label>
                    <input type="text" className="form-control mb-2" value={this.state.nama} onChange={ev => this.setState({ nama: ev.target.value })} required></input>
                  </div>
                  <div className="form-group">
                    <label>Alamat</label>
                    <input type="text" className="form-control mb-2" value={this.state.alamat} onChange={ev => this.setState({ alamat: ev.target.value })}></input>
                  </div>
                  <div className="form-group">
                    <label>Telepon</label>
                    <input type="text" className="form-control mb-2" value={this.state.telepon} onChange={ev => this.setState({ telepon: ev.target.value })}></input>
                  </div>
                  <div className="form-group">
                    <label>Jenis Kelamin</label>
                    <select className="form-control mb-2" value={this.state.jenis_kelamin} onChange={ev => this.setState({ jenis_kelamin: ev.target.value })}>
                      <option value="Pria">Pria</option>
                      <option value="Wanita">Wanita</option>
                    </select>
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
