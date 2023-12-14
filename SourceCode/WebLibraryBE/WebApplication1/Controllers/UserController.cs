using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.Entities;
using WebApplication1.Service;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        public readonly LibraryContext _context;
        private readonly IConfiguration _config;
        public UserController(LibraryContext ctx, IConfiguration config)
        {
            _context = ctx;
            _config = config;
        }
        [HttpGet("getToken/{SoDienThoai}")]
        public IActionResult GetToken(string SoDienThoai)
        {
            var user = _context.Nguoidungs.FirstOrDefault(u => u.Sdt == SoDienThoai);
            if (user == null)
            {
                return NotFound();
            }
            var key = _config["Jwt:Key"];
            var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var signinCredential = new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Sdt),
            };

            //tao token
            var tokenSetUp = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                expires: DateTime.Now.AddDays(2),
                signingCredentials: signinCredential,
                claims: claims
            );
            //sinh ra token với các thông số ở trên
            var accessToken = new JwtSecurityTokenHandler().WriteToken(tokenSetUp);
            // Trả về kết quả thành công
            return Ok(new { message = "success", accessToken });
        }
        [HttpGet("getUserFromToken/{Token}")]
        public IActionResult getUserFromToken(String Token)
        {
            string phone = GetUserId(Token);
            if (phone == null) return NotFound();
            var user = _context.Nguoidungs.FirstOrDefault(u => u.Sdt == phone);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        [HttpGet("getUser/{SDT}")]
        public IActionResult getUser(String SDT)
        {
            var user = _context.Nguoidungs.FirstOrDefault(u => u.Sdt == SDT);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        private string GetUserId(String Token)
        {
            Token = Token.PadRight(Token.Length + (4 - Token.Length % 4) % 4, '=');;
            if(Token == null) return null;
            string secretKey = _config["Jwt:Key"];

            if (Token == "undefined") return "";

            string username = VeryfiJWT.GetUsernameFromToken(Token, secretKey);
            return username;
        }
        [HttpPost("adduser")]
        public IActionResult AddUser([FromBody] Nguoidung user)
        {
            try
            {
                _context.Nguoidungs.Add(user);
                _context.SaveChanges();
                return Ok("User added successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
        [HttpGet("getAllUser")]
        public IActionResult getAllUser()
        {
            var users = _context.Nguoidungs.Where(nd => nd.Active == true);
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }

        [HttpPut("UpdateUser")]
        public IActionResult UpdateUser([FromBody] Nguoidung user)
        {
            var nguoiDungToUpdate = _context.Nguoidungs.FirstOrDefault(nd => nd.Sdt == user.Sdt);

            if (nguoiDungToUpdate != null)
            {
                nguoiDungToUpdate.HoTen = user.HoTen;
                nguoiDungToUpdate.TaiKhoan = user.TaiKhoan;
                nguoiDungToUpdate.MatKhau = user.MatKhau;
                _context.SaveChanges();
            }
            else 
            {
                return NotFound();
            }
            return Ok(new { nguoiDungToUpdate });
        }
        [HttpPut("DeleteUser/{SDT}")]
        public IActionResult DeleteUser(String SDT)
        {
            var nguoiDungToUpdate = _context.Nguoidungs.FirstOrDefault(nd => nd.Sdt == SDT);

            if (nguoiDungToUpdate != null)
            {
                nguoiDungToUpdate.Active = false;
                _context.SaveChanges();
            }
            else
            {
                return NotFound();
            }
            return Ok("User Deleted successfully!");
        }
    }
}