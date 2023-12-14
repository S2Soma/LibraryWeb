using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApplication1.ClassDTO;
using WebApplication1.Entities;
using static System.Reflection.Metadata.BlobBuilder;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SachController : Controller
    {
        public readonly LibraryContext _context;
        private readonly IConfiguration _config;
        public SachController(LibraryContext ctx, IConfiguration config)
        {
            _context = ctx;
            _config = config;
        }
        [HttpGet("getAllSach")]
        public IActionResult getAllSach()
        {
            var books = from sach in _context.Saches
                        join tacGia in _context.Tacgia on sach.TacGia equals tacGia.IdtacGia
                        join nxb in _context.Nhaxuatbans on sach.Nxb equals nxb.Idnxb
                        join theLoai in _context.Theloais on sach.TheLoai equals theLoai.IdtheLoai
                        where sach.Active == true
                        select new
                        {
                            IDSach = sach.Idsach,
                            TenSach = sach.TenSach,
                            TenTacGia = tacGia.TenTacGia,
                            TenNXB = nxb.TenNxb,
                            NamSX = sach.NamSx,
                            HinhAnh = sach.HinhAnh,
                            NoiDung = sach.NoiDung,
                            TenTheLoai = theLoai.TenTheLoai,
                            SoLuong = sach.SoLuong,
                            ConLai = sach.ConLai
                        };
            if (books == null)
            {
                return NotFound();
            }
            return Ok(books);
        }
        [HttpGet("getBookFromID/{ID}")]
        public IActionResult GetBookFromID(String ID)
        {
            var sachCanTim = _context.Saches
                .Where(sach => sach.Idsach == ID && sach.Active == true)
                .Join(_context.Tacgia, sach => sach.TacGia, tacGia => tacGia.IdtacGia, (sach, tacGia) => new { sach, tacGia })
                .Join(_context.Nhaxuatbans, combined => combined.sach.Nxb, nxb => nxb.Idnxb, (combined, nxb) => new { combined.sach, combined.tacGia, nxb })
                .Join(_context.Theloais, combined => combined.sach.TheLoai, theLoai => theLoai.IdtheLoai, (combined, theLoai) => new { combined.sach, combined.tacGia, combined.nxb, theLoai })
                .Select(result => new
                {
                    result.sach.Idsach,
                    result.sach.TenSach,
                    result.sach.HinhAnh,
                    result.tacGia.TenTacGia,
                    result.nxb.TenNxb,
                    result.sach.SoLuong,
                    result.sach.NoiDung,
                    result.sach.NamSx,
                    result.theLoai.TenTheLoai,
                    result.theLoai.IdtheLoai,
                    result.sach.ConLai
                })
                .FirstOrDefault();
            if (sachCanTim != null) return Ok(new { message = "success", sachCanTim });
            return NotFound();
        }
        [HttpGet("getCountBooks")]
        public IActionResult GetCountBooks()
        {
            int countAll = (int)_context.Saches.Where(sach => sach.Active == true).Sum(sach => sach.SoLuong);
            int countRemain = (int)_context.Saches.Where(sach => sach.Active == true).Sum(sach => sach.ConLai);
            int countBorrow = countAll - countRemain;
            int countReader = _context.Nguoidungs.Count(u => u.Active == true);
            int countBorrowTimes = _context.Muonsaches.Count(ms => ms.TrangThai == 1);
            int countBackTimes = _context.Muonsaches.Count(ms => ms.TrangThai == 2);
            return Ok(new { message = "success", countAll, countRemain, countBorrow, countReader, countBorrowTimes, countBackTimes });
        }
        [HttpGet("getAllGenre")]
        public IActionResult getAllGenre()
        {
            var genres = _context.Theloais.ToList();
            if (genres == null)
            {
                return NotFound();
            }
            return Ok(genres);
        }

        [HttpGet("getBookFromName/{Name}")]
        public IActionResult getBookFromName(String Name)
        {
            try
            {
                var result = _context.Saches.Where(s => s.TenSach == Name && s.Active == true).FirstOrDefault();
                if (result != null) return Ok(new {mess = "book is Existed!"});
                else return Ok(new { mess = "book not Existed!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("addBook")]
        public IActionResult AddBook([FromBody] Sach_DTO sach_DTO)
        {
            try
            {
                var thisTacGia = _context.Tacgia.Where(t => t.TenTacGia == sach_DTO.tenTacGia).FirstOrDefault();
                if (thisTacGia == null)
                {
                    int count = _context.Tacgia.Count();
                    thisTacGia = new Tacgium();
                    thisTacGia.IdtacGia = count + 1;
                    thisTacGia.TenTacGia = sach_DTO.tenTacGia;
                    _context.Tacgia.Add(thisTacGia);
                }
                var thisNXB = _context.Nhaxuatbans.Where(n => n.TenNxb == sach_DTO.NXB).FirstOrDefault();
                if (thisNXB == null)
                {
                    int count = _context.Nhaxuatbans.Count();
                    thisNXB = new Nhaxuatban();
                    thisNXB.Idnxb = count + 1;
                    thisNXB.TenNxb = sach_DTO.NXB;
                    _context.Nhaxuatbans.Add(thisNXB);
                }
                var thisTheLoai = _context.Theloais.Where(tl => tl.TenTheLoai == sach_DTO.tenTheLoai).FirstOrDefault();
                if (thisTheLoai == null)
                {
                    int count = _context.Theloais.Count();
                    thisTheLoai = new Theloai();
                    thisTheLoai.IdtheLoai = "" +(count + 1);
                    thisTheLoai.TenTheLoai = sach_DTO.NXB;
                    _context.Theloais.Add(thisTheLoai);
                }
                var thisBook = new Sach();
                int IdBook = _context.Saches.Count();
                thisBook.Idsach = "S00" + (IdBook + 1);
                thisBook.TenSach = sach_DTO.tenSach;
                thisBook.TacGia = thisTacGia.IdtacGia;
                thisBook.Nxb = thisNXB.Idnxb;
                thisBook.NamSx = sach_DTO.namXB;
                thisBook.TheLoai = thisTheLoai.IdtheLoai;
                thisBook.SoLuong = sach_DTO.soLuong;
                thisBook.NoiDung = sach_DTO.noidung;
                thisBook.HinhAnh = sach_DTO.hinhAnh;
                thisBook.TacGiaNavigation = thisTacGia;
                thisBook.NxbNavigation = thisNXB;
                thisBook.TheLoaiNavigation = thisTheLoai;
                thisBook.ConLai = sach_DTO.soLuong;
                thisBook.Active = true;
                _context.Add(thisBook);
                _context.SaveChanges();
                return Ok(new {mess = "Add book successfully!"});
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("updateBook/{id}")]
        public IActionResult UpdateBook(string id, [FromBody] Sach_DTO sach_DTO)
        {
            var existingBook = _context.Saches.Where(s => s.Idsach == id).FirstOrDefault();
            if (existingBook == null)
            {
                return NotFound(new { mess = "book not Existed!" });
            }
            try
            {
                if (!sach_DTO.tenTacGia.IsNullOrEmpty())
                {
                    var thisTacGia = _context.Tacgia.Where(t => t.TenTacGia == sach_DTO.tenTacGia).FirstOrDefault();
                    if (thisTacGia == null)
                    {
                        int count = _context.Tacgia.Count();
                        thisTacGia = new Tacgium();
                        thisTacGia.IdtacGia = count + 1;
                        thisTacGia.TenTacGia = sach_DTO.tenTacGia;
                        _context.Tacgia.Add(thisTacGia);
                    }
                    existingBook.TacGia = thisTacGia.IdtacGia;
                    existingBook.TacGiaNavigation = thisTacGia;
                }
                if (!sach_DTO.NXB.IsNullOrEmpty())
                {
                    var thisNXB = _context.Nhaxuatbans.Where(n => n.TenNxb == sach_DTO.NXB).FirstOrDefault();
                    if (thisNXB == null)
                    {
                        int count = _context.Nhaxuatbans.Count();
                        thisNXB = new Nhaxuatban();
                        thisNXB.Idnxb = count + 1;
                        thisNXB.TenNxb = sach_DTO.NXB;
                        _context.Nhaxuatbans.Add(thisNXB);
                    }
                    existingBook.Nxb = thisNXB.Idnxb;
                    existingBook.NxbNavigation = thisNXB;
                }  
                if(!sach_DTO.tenTheLoai.IsNullOrEmpty())
                {
                    var thisTheLoai = _context.Theloais.Where(tl => tl.TenTheLoai == sach_DTO.tenTheLoai).FirstOrDefault();
                    if (thisTheLoai == null)
                    {
                        int count = _context.Theloais.Count();
                        thisTheLoai = new Theloai();
                        thisTheLoai.IdtheLoai = "" + (count + 1);
                        thisTheLoai.TenTheLoai = sach_DTO.NXB;
                        _context.Theloais.Add(thisTheLoai);
                    }
                    existingBook.TheLoai = thisTheLoai.IdtheLoai;
                    existingBook.TheLoaiNavigation = thisTheLoai;
                }
                if (!sach_DTO.tenSach.IsNullOrEmpty()) existingBook.TenSach = sach_DTO.tenSach;
                if (!sach_DTO.hinhAnh.IsNullOrEmpty()) existingBook.HinhAnh = sach_DTO.hinhAnh;
                if (sach_DTO.namXB != 0) existingBook.NamSx = sach_DTO.namXB;
                if (!sach_DTO.noidung.IsNullOrEmpty()) existingBook.NoiDung = sach_DTO.noidung;
                if(sach_DTO.soLuong > 0)
                {
                    int range = sach_DTO.soLuong - existingBook.SoLuong;
                    existingBook.SoLuong += range;
                    existingBook.ConLai += range;
                }    
                
                _context.SaveChanges();

                return Ok(new { mess = "Update book successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("deleteBook/{id}")]
        public IActionResult DeleteBook(string id)
        {
            var bookToDelete = _context.Saches.Where(s => s.Idsach == id).FirstOrDefault();

            if (bookToDelete == null)
            {
                return NotFound("Khong tim thay sach.");
            }

            try
            {
                bookToDelete.Active = false;
                _context.SaveChanges();
                return Ok(new { mess = "delete book successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

