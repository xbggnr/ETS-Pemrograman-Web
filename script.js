const initialData = [
    { nim: "5025251001", nama: "Andi Saputra", prodi: "Teknik Informatika", jenis: "Mahasiswa", email: "andi@email.com", alamat: "Jl. Merdeka", telepon: "0812345678" },
    { nim: "5026251020", nama: "Siti Rahma", prodi: "Sistem Informasi", jenis: "Mahasiswa", email: "siti@email.com", alamat: "Jl. Sudirman", telepon: "0812345679" },
    { nim: "195204171979031667", nama: "Budi Santoso", prodi: "Teknik Informatika", jenis: "Dosen", email: "budi@email.com", alamat: "Jl. Pahlawan", telepon: "0812345680" },
    { nim: "195204171979031019", nama: "Rizky Kurniawan", prodi: "Teknik Elektro", jenis: "Tenaga Kependidikan", email: "rizky@email.com", alamat: "Jl. Veteran", telepon: "0812345681" },
    { nim: "196512131990022023", nama: "Rusdi Hariadi", prodi: "Teknik Kelautan", jenis: "Tenaga Kependidikan", email: "rusdi@email.com", alamat: "Jl. Ngawi Barat", telepon: "082351278123" }
];

function initStorage() {
    if (!localStorage.getItem('dataAnggota')) {
        localStorage.setItem('dataAnggota', JSON.stringify(initialData));
    }
}
function getData() { return JSON.parse(localStorage.getItem('dataAnggota')); }
function saveData(data) { localStorage.setItem('dataAnggota', JSON.stringify(data)); }

document.addEventListener('DOMContentLoaded', () => {
    initStorage();

    const navLoginBtn = document.getElementById('navLoginBtn');
    if(navLoginBtn){
        const isLogin = localStorage.getItem('isLogin') === 'true';
        if (isLogin){
            navLoginBtn.textContent = 'Logout';
            navLoginBtn.href = '#';
            navLoginBtn.addEventListener('click', function(e){
                e.preventDefault();
                localStorage.removeItem('isLogin');
                alert('Anda berhasil logout');
                window.location.href = 'index.html';
            });
        } else {
            navLoginBtn.textContent = 'Login Petugas';
            navLoginBtn.href = 'login.html';
        }
    }

    const tableBody = document.getElementById('tableBody');
    if (tableBody) {
        renderTable();
        document.getElementById('searchInput').addEventListener('input', function(e) {
            renderTable(e.target.value);
        });
    }

    const formDaftar = document.getElementById('formPendaftaran');
    if (formDaftar) {
        formDaftar.addEventListener('submit', function(e) {
            e.preventDefault();
            const nim = document.getElementById('regNim').value.trim();
            const data = getData();
            const notifBox = document.getElementById('notifBox');

            if (data.some(a => a.nim === nim)) {
                notifBox.className = "alert alert-danger mt-3";
                notifBox.innerHTML = "Contoh galat: NIM/NIP sudah terdaftar.";
                notifBox.classList.remove('d-none');
                return;
            }

            const anggotaBaru = {
                nama: document.getElementById('regNama').value.trim(),
                nim: nim,
                prodi: document.getElementById('regProdi').value.trim(),
                alamat: document.getElementById('regAlamat').value.trim(),
                telepon: document.getElementById('regTelepon').value.trim(),
                email: document.getElementById('regEmail').value.trim(),
                jenis: document.getElementById('regJenis').value
            };

            data.push(anggotaBaru);
            saveData(data);

            notifBox.className = "alert alert-success mt-3";
            notifBox.innerHTML = "Contoh notifikasi sukses: Pendaftaran berhasil, data masuk ke daftar anggota.";
            notifBox.classList.remove('d-none');
            formDaftar.reset();
        });

        document.getElementById('btnReset').addEventListener('click', () => {
            document.getElementById('notifBox').classList.add('d-none');
        });
    }

    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        const daftarPetugas = [
            { email: "petugas@email.com", pass: "petugas123"},
            { email: "admin@email.com", pass: "admin123"},
        ];
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPass').value;
            const alertBox = document.getElementById('loginAlert');

            alertBox.classList.remove('d-none');
            const isValid = daftarPetugas.some(akun => akun.email === email && akun.pass === pass);
            if (isValid) {
                localStorage.setItem('isLogin', 'true')
                alertBox.className = "alert alert-success text-center mt-3 fw-semibold";
                alertBox.innerHTML = "Contoh berhasil: Autentifikasi Berhasil";
                setTimeout(() => window.location.href = "anggota.html", 1500);
            } else {
                alertBox.className = "alert alert-danger text-center mt-3 fw-semibold";
                alertBox.innerHTML = "Contoh gagal: Autentifikasi Gagal";
            }
        });
    }
});

function renderTable(keyword = "") {
    const data = getData();
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = "";

    const filtered = data.filter(a => 
        a.nama.toLowerCase().includes(keyword.toLowerCase()) || 
        a.nim.toLowerCase().includes(keyword.toLowerCase())
    );

    filtered.forEach((item, index) => {
        tbody.innerHTML += `
            <tr class="align-middle">
                <td>${index + 1}</td>
                <td class="fw-semibold">${item.nama}</td>
                <td>${item.nim}</td>
                <td>${item.prodi}</td>
                <td><span class="badge bg-light text-dark border">${item.jenis}</span></td>
                <td>${item.email}</td>
                <td>
                    <button class="btn btn-sm text-primary fw-semibold" onclick="alert('Detail ${item.nama}')">Detail</button>
                    <button class="btn btn-sm text-warning fw-semibold" onclick="alert('Edit belum diimplementasi detail')">Edit</button>
                    <button class="btn btn-sm text-danger fw-semibold" onclick="hapusData('${item.nim}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function hapusData(nim) {
    if (confirm("Hapus data anggota?\nData yang dihapus tidak dapat dikembalikan.")) {
        let data = getData();
        data = data.filter(a => a.nim !== nim);
        saveData(data);
        renderTable(document.getElementById('searchInput').value);
        alert("Contoh notifikasi: Data anggota berhasil diperbarui.");
    }
}