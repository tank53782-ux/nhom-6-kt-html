

function khoiTaoDuLieu() {
    let nguoiDungs = JSON.parse(localStorage.getItem('fitlife_nguoi_dungs'));
    if (!nguoiDungs || nguoiDungs.length === 0) {
       
        nguoiDungs = [
            { id: '#ADM001', name: 'Admin User', email: 'admin@fitlife.vn', password: '123', role: 'admin' },
            { id: '#MNG025', name: 'Trần Thị B', email: 'manager@fitlife.vn', password: '123', role: 'manager' }
        ];
        localStorage.setItem('fitlife_nguoi_dungs', JSON.stringify(nguoiDungs));
    }
    renderBang();
}

// RENDER TABLE 
function renderBang(vaiTroLoc = 'tat-ca', timKiemId = '') {
    const nguoiDungs = JSON.parse(localStorage.getItem('fitlife_nguoi_dungs')) || [];
    const tbody = document.getElementById('noi-dung-bang');
    tbody.innerHTML = '';

    nguoiDungs.forEach(nguoiDung => {
        
        if (vaiTroLoc !== 'tat-ca' && nguoiDung.role !== vaiTroLoc) return;
        if (timKiemId && !nguoiDung.id.toUpperCase().includes(timKiemId)) return;

        
        let vaiTroHtml = '';
        let vaiTroClass = '';
        if(nguoiDung.role === 'admin') { 
            vaiTroHtml = 'Admin'; 
            vaiTroClass = 'bg-purple-100 text-purple-600'; 
        }
        else if(nguoiDung.role === 'manager') { 
            vaiTroHtml = 'Quản lý'; 
            vaiTroClass = 'bg-blue-100 text-blue-600'; 
        }
        else { 
            vaiTroHtml = 'Người dùng'; 
            vaiTroClass = 'bg-gray-100 text-gray-600'; 
        }

        const row = document.createElement('tr');
        row.className = 'hang-tai-khoan hover:bg-gray-50 transition';
        row.innerHTML = `
            <td class="px-6 py-4 font-mono text-xs text-gray-500 font-bold id-tai-khoan">${nguoiDung.id}</td>
            <td class="px-6 py-4">
                <div>
                    <p class="font-bold text-gray-900">${nguoiDung.name}</p>
                    <p class="text-gray-400 text-xs">${nguoiDung.email}</p>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="${vaiTroClass} py-1 px-3 rounded-full text-xs font-bold">${vaiTroHtml}</span>
            </td>
            <td class="px-6 py-4 text-gray-500 font-mono text-xs">
                <div class="flex items-center gap-2">
                    <span class="hien-thi-mat-khau" data-password="${nguoiDung.password}">••••••••</span>
                    <button onclick="hienThiMatKhau(this)" class="text-gray-400 hover:text-green-500 focus:outline-none">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="xoaTaiKhoan('${nguoiDung.id}')" class="text-gray-400 hover:text-red-600 px-2" title="Xóa tài khoản">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ACTIONS 
function themTaiKhoanMoi() {
    const id = prompt("Nhập ID (VD: #USR999):");
    if (!id) return;
    const ten = prompt("Tên:");
    if (!ten) return;
    const email = prompt("Email:");
    if (!email) return;
    const vaiTro = prompt("Vai trò (admin/manager/user):", "user");
    if (!vaiTro) return;
    const matKhau = prompt("Mật khẩu:", "123456");
    if (!matKhau) return;

    let nguoiDungs = JSON.parse(localStorage.getItem('fitlife_nguoi_dungs')) || [];
    nguoiDungs.push({ id, name: ten, email, role: vaiTro.toLowerCase(), password: matKhau });
    localStorage.setItem('fitlife_nguoi_dungs', JSON.stringify(nguoiDungs));
    renderBang();
}

function xoaTaiKhoan(id) {
    if(confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
        let nguoiDungs = JSON.parse(localStorage.getItem('fitlife_nguoi_dungs')) || [];
        nguoiDungs = nguoiDungs.filter(u => u.id !== id);
        localStorage.setItem('fitlife_nguoi_dungs', JSON.stringify(nguoiDungs));
        renderBang();
    }
}

function chuyenTab(tabId, element) {
    document.querySelectorAll('.noi-dung-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    const titleMap = {
        'tong-quan': 'Tổng quan', 
        'tai-khoan': 'Quản lý tài khoản', 
        'cai-dat': 'Cài đặt'
    };
    
    if(titleMap[tabId]) {
        document.getElementById('tieu-de-trang').innerText = titleMap[tabId];
    }

    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (element) { 
        element.classList.add('active');
    }
}

function locTaiKhoan(vaiTro, btn) {
    document.querySelectorAll('.nut-loc').forEach(b => {
        b.classList.remove('active');
    });
    
    btn.classList.add('active');
    
    
    btn.parentElement.setAttribute('data-current-filter', vaiTro);
    renderBang(vaiTro, document.getElementById('tim-kiem-id').value.toUpperCase());
}

function timKiemTheoId() {
    const vaiTro = document.querySelector('.nut-loc.active')?.innerText === 'Admin' ? 'admin' :
                  document.querySelector('.nut-loc.active')?.innerText === 'Quản lý' ? 'manager' :
                  document.querySelector('.nut-loc.active')?.innerText === 'Người dùng' ? 'user' : 'tat-ca';
    
    renderBang(vaiTro, document.getElementById('tim-kiem-id').value.toUpperCase());
}

function hienThiMatKhau(btn) {
    const span = btn.parentElement.querySelector('.hien-thi-mat-khau');
    const icon = btn.querySelector('i');
    
    if (span.innerText.includes('•')) {
        span.innerText = span.getAttribute('data-password');
        icon.classList.remove('fa-eye'); 
        icon.classList.add('fa-eye-slash');
    } else {
        span.innerText = '••••••••';
        icon.classList.remove('fa-eye-slash'); 
        icon.classList.add('fa-eye');
    }
}

// Hàm hiển thị form đổi mật khẩu
function hienThiFormDoiMatKhau() {
    document.getElementById('modal-doi-mk').style.display = 'flex';
}


function dongModalDoiMk() {
    document.getElementById('modal-doi-mk').style.display = 'none';
    document.getElementById('form-doi-mk').reset();
}

// Xử lý sự kiện gửi form đổi mật khẩu
document.addEventListener('DOMContentLoaded', function() {
    khoiTaoDuLieu();
    
    const formDoiMk = document.getElementById('form-doi-mk');
    if (formDoiMk) {
        formDoiMk.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const matKhauHienTai = document.getElementById('mat-khau-hien-tai').value;
            const matKhauMoi = document.getElementById('mat-khau-moi').value;
            const nhapLaiMatKhauMoi = document.getElementById('nhap-lai-mat-khau-moi').value;
            
            
            if (matKhauMoi !== nhapLaiMatKhauMoi) {
                hienThiThongBao('Mật khẩu mới và nhập lại không khớp!', 'loi');
                return;
            }
            
            // Lấy danh sách người dùng từ localStorage
            let nguoiDungs = JSON.parse(localStorage.getItem('fitlife_nguoi_dungs')) || [];
            
            
            const adminIndex = nguoiDungs.findIndex(u => u.email === 'admin@fitlife.vn');
            
            if (adminIndex === -1) {
                hienThiThongBao('Không tìm thấy tài khoản admin!', 'loi');
                return;
            }
            
            
            if (nguoiDungs[adminIndex].password !== matKhauHienTai) {
                hienThiThongBao('Mật khẩu hiện tại không chính xác!', 'loi');
                return;
            }
            
            
            nguoiDungs[adminIndex].password = matKhauMoi;
            
            
            localStorage.setItem('fitlife_nguoi_dungs', JSON.stringify(nguoiDungs));
            
            
            hienThiThongBao('Đổi mật khẩu thành công!', 'thanh-cong');
            
            
            setTimeout(function() {
                dongModalDoiMk();
            }, 2000);
        });
    }
});


function hienThiThongBao(message, type = 'thong-tin') {
    
    const thongBao = document.createElement('div');
    thongBao.className = 'thong-bao';
    
   
    if (type === 'loi') {
        thongBao.classList.add('loi');
    } else if (type === 'thanh-cong') {
        thongBao.classList.add('thanh-cong');
    } else {
        thongBao.classList.add('thong-tin');
    }
    
    thongBao.textContent = message;
    
    document.body.appendChild(thongBao);
    
   
    setTimeout(() => {
        thongBao.classList.add('hien-thi');
    }, 100);
    
   
    setTimeout(() => {
        thongBao.classList.remove('hien-thi');
        setTimeout(() => {
            document.body.removeChild(thongBao);
        }, 300);
    }, 3000);
}


function kiemTraDangNhap() {
    const nguoiDungHienTai = JSON.parse(localStorage.getItem('nguoi_dung_hien_tai'));
    return nguoiDungHienTai !== null;
}


function layNguoiDungHienTai() {
    return JSON.parse(localStorage.getItem('nguoi_dung_hien_tai'));
}


function dangXuat() {
    localStorage.removeItem('nguoi_dung_hien_tai');
    window.location.href = 'dn.html';
}