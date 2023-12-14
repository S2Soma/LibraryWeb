using System;
using System.Collections.Generic;

namespace WebApplication1.Entities;

public partial class Trangthai
{
    public int IdtrangThai { get; set; }

    public string? TenTrangThai { get; set; }

    public virtual ICollection<Muonsach> Muonsaches { get; set; } = new List<Muonsach>();
}
