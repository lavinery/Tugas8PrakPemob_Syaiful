import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mahasiswa',
  templateUrl: './mahasiswa.page.html',
  styleUrls: ['./mahasiswa.page.scss'],
})
export class MahasiswaPage implements OnInit {
  dataMahasiswa: any;

  constructor(private api: ApiService, private modal: ModalController, private alert: AlertController) { }

  ngOnInit() {
    this.getMahasiswa();
  }

  getMahasiswa() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataMahasiswa = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  showAlert = false;
alertHeader: string = '';
alertMessage: string = '';


  modalTambah: any;
id: any;
nama: any;
jurusan: any;

resetModal() {
  this.id = null;
  this.nama = '';
  this.jurusan = '';
}

openModalTambah(isOpen: boolean) {
  this.modalTambah = isOpen;
  this.resetModal();
  this.modalTambah = true;
  this.modalEdit = false;
}

cancel() {
  this.modal.dismiss();
  this.modalTambah = false;
  this.modalEdit = false;
  this.resetModal();
}

showSuccessAlert(header: string, message: string) {
  this.alertHeader = header;
  this.alertMessage = message;
  this.showAlert = true; 
}

tambahMahasiswa() {
  if (this.nama !== '' && this.jurusan !== '') {
    let data = {
      nama: this.nama,
      jurusan: this.jurusan,
    };
    this.api.tambah(data, 'tambah.php').subscribe({
      next: (hasil: any) => {
        this.resetModal();
        this.getMahasiswa();
        this.modalTambah = false;
        this.modal.dismiss();
        this.showSuccessAlert('Tambah Data', 'Data berhasil ditambahkan');
      },
      error: (err: any) => {
        console.log('gagal tambah mahasiswa');
      },
    });
  } else {
    console.log('gagal tambah mahasiswa karena masih ada data yg kosong');
  }
}


hapusMahasiswa(id: any) {
  this.confirmDelete(id);
}

async confirmDelete(id: any) {
  const alert = await this.alert.create({
    header: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus data ini?',
    buttons: [
      {
        text: 'Batal',
        role: 'cancel',
        handler: () => {
          console.log('Penghapusan dibatalkan');
        },
      },
      {
        text: 'Hapus',
        role: 'destructive',
        handler: () => {
          this.api.hapus(id, 'hapus.php?id=').subscribe({
            next: (res: any) => {
              this.getMahasiswa();
              this.showSuccessAlert('Hapus Data', 'Data berhasil dihapus');
            },
            error: (error: any) => {
              console.log('gagal');
            },
          });
        },
      },
    ],
  });

  await alert.present();
}

ambilMahasiswa(id: any) {
  this.api.lihat(id,
    'lihat.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let mahasiswa = hasil;
        this.id = mahasiswa.id;
        this.nama = mahasiswa.nama;
        this.jurusan = mahasiswa.jurusan;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      }
    })
}

modalEdit: any;

openModalEdit(isOpen: boolean, idget: any) {
  this.modalEdit = isOpen;
  this.id = idget;
  console.log(this.id);
  this.ambilMahasiswa(this.id);
  this.modalTambah = false;
  this.modalEdit = true;
}

editMahasiswa() {
  let data = {
    id: this.id,
    nama: this.nama,
    jurusan: this.jurusan,
  };
  this.api.edit(data, 'edit.php').subscribe({
    next: (hasil: any) => {
      this.resetModal();
      this.getMahasiswa();
      this.showSuccessAlert('Edit Data', 'Data berhasil diubah');
      this.modalEdit = false;
      this.modal.dismiss();
    },
    error: (err: any) => {
      console.log('gagal edit Mahasiswa');
    },
  });
}
}