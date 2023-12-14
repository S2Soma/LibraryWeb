using System;
using System.Collections.Generic;

namespace WebApplication1.Entities;

public partial class Nguoidung
{
    public string Sdt { get; set; } = null!;

    public string? HoTen { get; set; }

    public string? TaiKhoan { get; set; }

    public string? MatKhau { get; set; }

    public bool? Admin { get; set; }

    public bool? Active { get; set; }

    public virtual ICollection<Muonsach> Muonsaches { get; set; } = new List<Muonsach>();
}
