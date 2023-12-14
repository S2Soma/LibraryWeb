using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Entities;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        public readonly LibraryContext _context;
        public LoginController(LibraryContext ctx)
        {
            _context = ctx;
        }

        [HttpGet("getAllUser")]
        public async Task<IActionResult> GetAllUsers()
        {
            var userList = _context.Nguoidungs.Where(u => u.Active == true).ToList();
            return Ok(userList);

        }
        [HttpGet("getUserLogin/{TaiKhoan}")]
        public IActionResult GetUserByAccount(string TaiKhoan)
        {
            var user = _context.Nguoidungs.FirstOrDefault(u => u.TaiKhoan.Trim() == TaiKhoan && u.Active == true);

            if (user == null)
            {
                return NotFound(); // Trả về 404 nếu không tìm thấy người dùng
            }

            return Ok(user); // Trả về người dùng dưới dạng JSON
        }
    }
}
