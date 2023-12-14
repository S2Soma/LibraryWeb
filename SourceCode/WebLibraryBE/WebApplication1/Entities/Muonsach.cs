using System;
using System.Collections.Generic;

namespace WebApplication1.Entities;

public partial class Muonsach
{
    public string IdmuonSach { get; set; } = null!;

    public string? NguoiMuon { get; set; }

    public string? ThoiHan { get; set; }

    public int? TrangThai { get; set; }

    public DateTime? NgayMuon { get; set; }

    public virtual ICollection<Chitietmuonsach> Chitietmuonsaches { get; set; } = new List<Chitietmuonsach>();

    public virtual Nguoidung? NguoiMuonNavigation { get; set; }

    public virtual Trangthai? TrangThaiNavigation { get; set; }
}
