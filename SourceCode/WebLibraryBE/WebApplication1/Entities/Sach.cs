using System;
using System.Collections.Generic;

namespace WebApplication1.Entities;

public partial class Sach
{
    public string Idsach { get; set; } = null!;

    public string? TenSach { get; set; }

    public string? HinhAnh { get; set; }

    public int? Nxb { get; set; }

    public int? TacGia { get; set; }

    public int? NamSx { get; set; }

    public string? TheLoai { get; set; }

    public string? NoiDung { get; set; }

    public int SoLuong { get; set; }

    public int? ConLai { get; set; }

    public bool? Active { get; set; }

    public virtual ICollection<Chitietmuonsach> Chitietmuonsaches { get; set; } = new List<Chitietmuonsach>();

    public virtual Nhaxuatban? NxbNavigation { get; set; }

    public virtual Tacgium? TacGiaNavigation { get; set; }

    public virtual Theloai? TheLoaiNavigation { get; set; }
}
