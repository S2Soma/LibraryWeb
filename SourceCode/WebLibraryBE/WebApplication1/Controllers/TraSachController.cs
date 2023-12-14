
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TraSachController : ControllerBase
    {
        public readonly LibraryContext _context;
        private readonly IConfiguration _config;

        public TraSachController(LibraryContext ctx, IConfiguration config)
        {
            _context = ctx;
            _config = config;
        }
        [HttpGet("getAllBorrowBook/{SDT}")]
       public async Task<IActionResult> getAllBorrowBook(String SDT)
       {
            try
            {
                var user = _context.Nguoidungs.FirstOrDefault(u => u.Sdt == SDT && u.Active == true);
                var result = from nguoiDung in _context.Nguoidungs
                             join muonSach in _context.Muonsaches
                             on nguoiDung.Sdt equals muonSach.NguoiMuon
                             where nguoiDung.Active == true && muonSach.TrangThai == 1 && nguoiDung.Sdt == SDT
                             select new
                             {
                                 nguoiDung.Sdt,
                                 nguoiDung.HoTen,
                                 muonSach.IdmuonSach,
                                 muonSach.NgayMuon,
                                 muonSach.ThoiHan
                             };
                if (result.Count() > 0)
               {
                   return Ok(new { result, user});
               }
           }
           catch (Exception ex)
           {
               return BadRequest($"Error: {ex.Message}");
           }
           return NotFound();
       }
        [HttpGet("LayChiTietMuonSach/{IDMuon}")]
        public async Task<IActionResult> LayChiTietMuonSach(String IDMuon)
        {
            try
            {
                var result = from chitiet in _context.Chitietmuonsaches
                            join sach in _context.Saches on chitiet.Sach equals sach.Idsach
                            where chitiet.MaMuonSach == IDMuon
                            select new { 
                                chitiet.SoLuong, 
                                sach.TenSach };
                if (result.Count() > 0)
                {
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
            return NotFound();
        }
        [HttpGet("tra_sach/{SDT}")]
        public  async Task<IActionResult> TraSach (string SDT)
        {
           
            var query = from nguoiDung in _context.Nguoidungs
                        join muonSach in _context.Muonsaches on nguoiDung.Sdt equals muonSach.NguoiMuon
                        join chiTietMuonSach in _context.Chitietmuonsaches on muonSach.IdmuonSach equals chiTietMuonSach.MaMuonSach
                        join sach in _context.Saches on chiTietMuonSach.Sach equals sach.Idsach
                        where nguoiDung.Sdt == SDT && nguoiDung.Active == true && (muonSach.TrangThai == 1 || muonSach.TrangThai == 3)
                        select new
                        {
                            // Select the properties you need
                            IDMuonSach = muonSach.IdmuonSach,
                            Hoten = nguoiDung.HoTen,
                            MaMuonSach = chiTietMuonSach.MaMuonSach,
                            TenSach = sach.TenSach,
                            NgayMuon = muonSach.NgayMuon,
                            ThoiHan = muonSach.ThoiHan,
                            SoLuong = chiTietMuonSach.SoLuong
                        };
            if (query == null)
            {
                return NotFound();
            }
            var  user = await _context.Nguoidungs.FindAsync(SDT);           
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new { message = "success" , query, user });
        }
        [HttpPut("DeleteChiTietMuonSach/{idMuonSach}")]
        public async Task<IActionResult> DeleteChiTietMuonSach(string idMuonSach)
        {
            try
            {
                var muonSach = _context.Muonsaches.SingleOrDefault(ms => ms.IdmuonSach == idMuonSach);
                if (muonSach != null)
                {
                    muonSach.TrangThai = 2;
                    var ctMuonSach = await _context.Chitietmuonsaches.Where(ct => ct.MaMuonSach == idMuonSach).ToListAsync();
                    if(ctMuonSach == null)
                    {
                        return NotFound();
                    }    
                    foreach(Chitietmuonsach ct in ctMuonSach)
                    {
                        var querySach = _context.Saches.SingleOrDefault(s => s.Idsach == ct.Sach);
                        if (querySach == null) continue;
                        querySach.ConLai += ct.SoLuong;
                    }    
                    _context.SaveChanges();
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error: {ex.Message}" });
            }
            return Ok(new { message = "success"});

        }
    }
}