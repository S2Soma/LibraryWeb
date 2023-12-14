using System;
using System.Collections.Generic;

namespace WebApplication1.Entities;

public partial class Tacgium
{
    public int IdtacGia { get; set; }

    public string? TenTacGia { get; set; }

    public virtual ICollection<Sach> Saches { get; set; } = new List<Sach>();
}
