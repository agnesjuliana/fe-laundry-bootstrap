import React, { Component } from 'react'
import axios from 'axios'
import { Modal } from "bootstrap"
import { authorization, baseUrl, formatNumber } from '../config/config'

export default class UserPage extends Component {
  constructor() {
    super()
    this.state = {

      users: [],
      id_user: "",
      nama: "",
      username: "",
      password: "",
      role: "",
      action: "",
      visible: true,
      fillPassword: ""
    }

    if (!localStorage.getItem("token")) {
        window.location.href = "/denied"
    }else {
      const userRaw = localStorage.getItem('user')
      const role = JSON.parse(userRaw).role.toLowerCase()

      if(role !== 'admin'){
        window.location.href = "/denied"
      }
    }
  }

  tambahData() {
    this.modalUser = new Modal(document.getElementById("modal_user"))
    this.modalUser.show() // menampilkan modal

    // reset state untuk form member
    this.setState({
      action: "tambah",
      id_user: Math.random(1, 100000),
      nama: "",
      username: "",
      password: "",
      role: "Admin",
      fillPassword: true
    })
  }

  ubahData(id_user) {
    this.modalUser = new Modal(document.getElementById("modal_user"))
    this.modalUser.show() // menampilkan modal

    // mencari index posisi dari data member yang akan diubah
    let index = this.state.users.findIndex(
      (user) => user.id_user === id_user
    )

    // reset state untuk form users
    this.setState({
      action: "ubah",
      id_user: this.state.users[index].id_user,
      nama: this.state.users[index].nama,
      password: '',
      username: this.state.users[index].username,
      role: this.state.users[index].role,
      fillPassword: false
    })
  }
  simpanData(event) {
    event.preventDefault();
    // preventDefault -> mencegah aksi default dari form submit

    this.modalUser.hide()

    if (this.state.action === "tambah") {
      let endpoint = "http://localhost:8000/api/users/"
      // menampung data isian dari user
      let data = {
        id_user: this.state.id_user,
        nama: this.state.nama,
        username: this.state.username,
        password: this.state.password,
        role: this.state.role
      }

      // tambahkan ke state user (array)
      //let temp = this.state.users
      //temp.push(data) // menambah data pada array
      //this.setState({ users: temp })

      axios.post(endpoint, data, authorization)
        .then(response => {
          window.alert(response.data.message)
          this.getData()
        })
        .catch(error => console.log(error))

      // menghilangkan modal
      this.modalUser.hide()
    } else if (this.state.action === "ubah") {
      let endpoint = "http://localhost:8000/api/users/" + this.state.id_user

      let data = {
        id_user: this.state.id_user,
        nama: this.state.nama,
        username: this.state.username,
        password: this.state.password,
        role: this.state.role
      }

      if (this.state.fillPassword === true) {
        data.password = this.state.password
      }

      axios.put(endpoint, data, authorization)
        .then(response => {
          window.alert(response.data.message)
          this.getData()
        })
        .catch(error => console.log(error))


      // let temp = this.state.users
      // let index = temp.findIndex(
      //    user => user.id_user === this.state.id_user
      // )

      // temp[index].nama = this.state.nama
      // temp[index].alamat = this.state.alamat
      // temp[index].jenis_kelamin = this.state.jenis_kelamin
      // temp[index].telepon = this.state.telepon

      // this.setState({ members: temp })

      // this.modalMember.hide()
    }
  }

  hapusData(id_user) {
    if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
      let endpoint = "http://localhost:8000/api/users/" + id_user

      axios.delete(endpoint, authorization)
        .then(response => {
          window.alert(response.data.message)
          this.getData()
        })
        .catch(error => console.log(error))

      // // mencari posisi index dari data yang dihapus
      // let temp = this.state.users
      // let index = temp.findIndex(user => user.id_user === id_user)

      // // dihapus data pada array
      // temp.splice(index, 1)

      // this.setState({ users: temp })
    }
  }

  getData() {
    let endpoint = "http://localhost:8000/api/users/"
    // method = GET
    axios.get(endpoint, authorization)
      .then(response => {
        this.setState({ users: response.data })
      })
      .catch(error => console.log(error))
  }
  componentDidMount() {
    // fungsi ini dijalankan setelah fungsi render berjalan
    this.getData()
    let user = JSON.parse(localStorage.getItem("user"))
    this.setState({ role: user.role })

    if (user.role === "Admin") {
      this.setState({ visible: true })
    } else {
      this.setState({ visible: false })
    }
  }

  showPassword() {
    if (this.state.fillPassword === true) {
      return (
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control mb-1"
            required
            value={this.state.password}
            onChange={ev => this.setState({ password: ev.target.value })}
          />
        </div>
      )
    } else {
      return (
        <button className="mb-1 btn btn-secondary"
          onClick={() => this.setState({ fillPassword: true })}>
          Change Password
        </button>

      )
    }
  }

  render() {
    return (
      <div className="user-page">
        <div className="main-content">
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h3 className="text-black pt-4">Data User</h3>
            <button className="btn mine" type="button" onClick={() => this.tambahData()}>Tambah User</button>
          </div>

          {/* tabel start */}
          <div className="card shadow table w-100">
            <table className="table table-striped">
              <thead className='cp-main'>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ID</th>
                  <th scope="col">Nama</th>
                  <th scope="col">Username</th>
                  <th scope="col">Role</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.users.map((user, i) => (

                  <tr>
                    <th scope="row">{i + 1}</th>
                    <td>{user.id_user}</td>
                    <td>{user.nama}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="btn btn-info btn-sm mt-1 mx-2" onClick={() => this.ubahData(user.id_user)}>Edit</button>
                      <button className="btn btn-danger btn-sm mt-1" onClick={() => this.hapusData(user.id_user)}>Hapus</button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* form modal user */}
        <div className="modal" id="modal_user">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header cp-main">
                <h4 className="text-white">
                  Form Data Users
                </h4>
              </div>

              <div className="modal-body cp-soft">
                <form onSubmit={ev => this.simpanData(ev)}>
                  <div className="form-group">
                    <label>Nama</label>
                    <input type="text" className="form-control mb-2"
                      value={this.state.nama}
                      onChange={(ev) => this.setState({ nama: ev.target.value })} />
                  </div>

                  <div className="form-group">
                    <label>Username</label>
                    <input type="text" className="form-control mb-2"
                      value={this.state.username}
                      onChange={(ev) => this.setState({ username: ev.target.value })} />
                  </div>

                  {this.showPassword()}

                  <div className="form-group">
                    <label>Role</label>
                    <select className="form-control mb-2"
                      value={this.state.role}
                      onChange={(ev) => this.setState({ role: ev.target.value })}>
                      <option value="Admin">Admin</option>
                      <option value="Kasir">Kasir</option>
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
