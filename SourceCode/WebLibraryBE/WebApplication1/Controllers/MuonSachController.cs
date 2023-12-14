using WebApplication1.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.ClassDTO;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MuonSachController : ControllerBase
    {
        public readonly LibraryContext _context;
        private readonly IConfiguration _config;

        public MuonSachController(LibraryContext ctx, IConfiguration config)
        {
            _context = ctx;
            _config = config;

        }
        [HttpGet("get_sach/{IdSach}")]
        public async Task<IActionResult> GetSach(string IdSach)
        {
            var querySach = await _context.Saches.Where(s => s.Idsach == IdSach && s.Active == true).ToListAsync();
            var result = querySach.Join(
                _context.Tacgia,
                q => q.TacGia,
                t => t.IdtacGia,
                (q, t) => new { q.TenSach, t.TenTacGia, q.HinhAnh ,q.Idsach, q.ConLai}
                );
            return Ok(new { message = "success", result});

        }
        [HttpPost("NguoiDungMuonSach/{SDT}")]
        public async Task<IActionResult> NguoiDungMuonSach(string SDT, [FromBody] Muonsach muonsach)
        {
            try
            {
                _context.Muonsaches.Add(muonsach);
                _context.SaveChanges();
                return Ok("User added successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }

        }
        [HttpPost("AddgMuonSach")]
        public async Task<IActionResult> AddMuonSach([FromBody] MuonSach_DTO muonSach_DTO)
        {
            try
            {
                var user = await _context.Nguoidungs.FirstOrDefaultAsync(u => u.Sdt == muonSach_DTO.SoDienThoai && u.Active == true);
                if(user == null)
                {
                    user = new Nguoidung();
                    user.Sdt = muonSach_DTO.SoDienThoai;
                    user.HoTen = muonSach_DTO.HoTen;
                    user.MatKhau = "12345";
                    user.TaiKhoan = muonSach_DTO.SoDienThoai;
                    user.Admin = false;
                    user.Active = true;
                    _context.Nguoidungs.Add(user);
                }
                var id = "MS00" + (_context.Muonsaches.Count() + 1);
                Muonsach ms = new Muonsach();
                ms.IdmuonSach = id;
                ms.ThoiHan = muonSach_DTO.ThoiHan;
                ms.NguoiMuon = muonSach_DTO.SoDienThoai;
                ms.NgayMuon = DateTime.Now;
                ms.NguoiMuonNavigation = user;
                ms.TrangThai = 1;
                _context.Muonsaches.Add(ms);
                _context.SaveChanges();
                return Ok(new { ID = id });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }

        }
        [HttpPost("LuuChiTietMuonSach")]
        public async Task<IActionResult> LuuChiTietMuonSach([FromBody] IEnumerable<ChiTietMS_DTO> ctmuonsaches)
        {
            try
            {
                foreach(ChiTietMS_DTO ct in ctmuonsaches)
                {
                    var existingMS = _context.Muonsaches.Find(ct.MaMuonSach);
                    var existingBook = _context.Saches.Find(ct.Sach);

                    if (existingMS == null || existingBook == null)
                    {
                        continue;
                    }

                    // Tạo một đối tượng DetailBill và thêm vào DbContext
                    Chitietmuonsach ctms = new Chitietmuonsach();
                    ctms.MaMuonSach = ct.MaMuonSach;
                    ctms.Sach = ct.Sach;
                    ctms.SoLuong = ct.SoLuong;
                    ctms.MaMuonSachNavigation = existingMS;
                    ctms.SachNavigation = existingBook;
                    existingBook.ConLai -= ctms.SoLuong;
                    _context.Chitietmuonsaches.Add(ctms);
                }    
                _context.SaveChanges();
                return Ok("Details added successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
    } 
}