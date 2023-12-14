using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Entities;

public partial class LibraryContext : DbContext
{
    public LibraryContext()
    {
    }

    public LibraryContext(DbContextOptions<LibraryContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Chitietmuonsach> Chitietmuonsaches { get; set; }

    public virtual DbSet<Muonsach> Muonsaches { get; set; }

    public virtual DbSet<Nguoidung> Nguoidungs { get; set; }

    public virtual DbSet<Nhaxuatban> Nhaxuatbans { get; set; }

    public virtual DbSet<Sach> Saches { get; set; }

    public virtual DbSet<Tacgium> Tacgia { get; set; }

    public virtual DbSet<Theloai> Theloais { get; set; }

    public virtual DbSet<Trangthai> Trangthais { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Data Source=DESKTOP-UF8A456\\SQLCNPM;Initial Catalog=Library;Integrated Security=True; TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Chitietmuonsach>(entity =>
        {
            entity.HasKey(e => new { e.MaMuonSach, e.Sach });

            entity.ToTable("CHITIETMUONSACH");

            entity.Property(e => e.MaMuonSach)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.Sach)
                .HasMaxLength(10)
                .IsFixedLength();

            entity.HasOne(d => d.MaMuonSachNavigation).WithMany(p => p.Chitietmuonsaches)
                .HasForeignKey(d => d.MaMuonSach)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CHITIETMUONSACH_MUONSACH");

            entity.HasOne(d => d.SachNavigation).WithMany(p => p.Chitietmuonsaches)
                .HasForeignKey(d => d.Sach)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CHITIETMUONSACH_SACH");
        });

        modelBuilder.Entity<Muonsach>(entity =>
        {
            entity.HasKey(e => e.IdmuonSach).HasName("PK_BORROWER");

            entity.ToTable("MUONSACH");

            entity.Property(e => e.IdmuonSach)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("IDMuonSach");
            entity.Property(e => e.NgayMuon).HasColumnType("datetime");
            entity.Property(e => e.NguoiMuon)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.ThoiHan).HasMaxLength(255);

            entity.HasOne(d => d.NguoiMuonNavigation).WithMany(p => p.Muonsaches)
                .HasForeignKey(d => d.NguoiMuon)
                .HasConstraintName("FK_MUONSACH_NGUOIDUNG");

            entity.HasOne(d => d.TrangThaiNavigation).WithMany(p => p.Muonsaches)
                .HasForeignKey(d => d.TrangThai)
                .HasConstraintName("FK_MUONSACH_TRANGTHAI");
        });

        modelBuilder.Entity<Nguoidung>(entity =>
        {
            entity.HasKey(e => e.Sdt).HasName("PK_USER");

            entity.ToTable("NGUOIDUNG");

            entity.Property(e => e.Sdt)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.MatKhau)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.TaiKhoan)
                .HasMaxLength(10)
                .IsFixedLength();
        });

        modelBuilder.Entity<Nhaxuatban>(entity =>
        {
            entity.HasKey(e => e.Idnxb).HasName("PK_PRODUCER");

            entity.ToTable("NHAXUATBAN");

            entity.Property(e => e.Idnxb)
                .ValueGeneratedNever()
                .HasColumnName("IDNXB");
            entity.Property(e => e.TenNxb).HasColumnName("TenNXB");
        });

        modelBuilder.Entity<Sach>(entity =>
        {
            entity.HasKey(e => e.Idsach).HasName("PK_BOOK");

            entity.ToTable("SACH");

            entity.Property(e => e.Idsach)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("IDSach");
            entity.Property(e => e.NamSx).HasColumnName("NamSX");
            entity.Property(e => e.Nxb).HasColumnName("NXB");
            entity.Property(e => e.TheLoai)
                .HasMaxLength(10)
                .IsFixedLength();

            entity.HasOne(d => d.NxbNavigation).WithMany(p => p.Saches)
                .HasForeignKey(d => d.Nxb)
                .HasConstraintName("FK_SACH_NHAXUATBAN");

            entity.HasOne(d => d.TacGiaNavigation).WithMany(p => p.Saches)
                .HasForeignKey(d => d.TacGia)
                .HasConstraintName("FK_SACH_TACGIA");

            entity.HasOne(d => d.TheLoaiNavigation).WithMany(p => p.Saches)
                .HasForeignKey(d => d.TheLoai)
                .HasConstraintName("FK_SACH_THELOAI");
        });

        modelBuilder.Entity<Tacgium>(entity =>
        {
            entity.HasKey(e => e.IdtacGia).HasName("PK_AUTHOR");

            entity.ToTable("TACGIA");

            entity.Property(e => e.IdtacGia)
                .ValueGeneratedNever()
                .HasColumnName("IDTacGia");
        });

        modelBuilder.Entity<Theloai>(entity =>
        {
            entity.HasKey(e => e.IdtheLoai).HasName("PK_CATEGORY");

            entity.ToTable("THELOAI");

            entity.Property(e => e.IdtheLoai)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("IDTheLoai");
        });

        modelBuilder.Entity<Trangthai>(entity =>
        {
            entity.HasKey(e => e.IdtrangThai).HasName("PK_STATUS");

            entity.ToTable("TRANGTHAI");

            entity.Property(e => e.IdtrangThai)
                .ValueGeneratedNever()
                .HasColumnName("IDTrangThai");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
