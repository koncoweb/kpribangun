$connectionString = "Server=db.mvigmyzmcfjfxikasvuq.supabase.co;Port=5432;Database=postgres;User Id=postgres;Password=kpribangun123#Jaya;SSL Mode=Require;Trust Server Certificate=true"

try {
    # Cek apakah modul PostgreSQL sudah terinstal
    if (-not (Get-Module -ListAvailable -Name PSPostgreSQL)) {
        Write-Host "Menginstal modul PSPostgreSQL..."
        Install-Module -Name PSPostgreSQL -Force -Scope CurrentUser
    }

    # Import modul PostgreSQL
    Import-Module PSPostgreSQL

    # Buat koneksi ke database
    Write-Host "Menghubungkan ke database Supabase..."
    $conn = Connect-PostgreSQL -ConnectionString $connectionString

    # Query untuk mendapatkan daftar tabel di schema public
    $query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    
    # Eksekusi query
    Write-Host "Mengambil daftar tabel..."
    $result = Invoke-PostgreSQLQuery -Connection $conn -Query $query
    
    # Tampilkan hasil
    Write-Host "Tabel di schema public:"
    if ($result.Count -eq 0) {
        Write-Host "Tidak ada tabel yang ditemukan"
    } else {
        foreach ($row in $result) {
            Write-Host "- $($row.table_name)"
        }
    }

    # Tutup koneksi
    Disconnect-PostgreSQL -Connection $conn
} catch {
    Write-Host "Error: $_"
    
    # Jika error terkait dengan modul PSPostgreSQL, berikan instruksi alternatif
    if ($_.Exception.Message -like "*PSPostgreSQL*") {
        Write-Host "`nAlternatif: Anda dapat melihat tabel di Supabase dengan cara:"
        Write-Host "1. Login ke dashboard Supabase di https://supabase.com/dashboard"
        Write-Host "2. Pilih proyek Anda"
        Write-Host "3. Buka 'Table Editor' untuk melihat daftar tabel"
        Write-Host "4. Atau gunakan SQL Editor dan jalankan query:"
        Write-Host "   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
    }
}
