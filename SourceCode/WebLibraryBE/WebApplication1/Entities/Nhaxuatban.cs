using System;
using System.Collections.Generic;

namespace WebApplication1.Entities;

public partial class Nhaxuatban
{
    public int Idnxb { get; set; }

    public string? TenNxb { get; set; }

    public virtual ICollection<Sach> Saches { get; set; } = new List<Sach>();
}
