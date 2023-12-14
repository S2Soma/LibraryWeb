using System;
using System.Collections.Generic;

namespace WebApplication1.Entities;

public partial class Chitietmuonsach
{
    public string MaMuonSach { get; set; } = null!;

    public string Sach { get; set; } = null!;

    public int? SoLuong { get; set; }

    public virtual Muonsach MaMuonSachNavigation { get; set; } = null!;

    public virtual Sach SachNavigation { get; set; } = null!;
}
