$supabaseUrl = "https://mvigmyzmcfjfxikasvuq.supabase.co"
$supabaseKey = "sbp_d33ef4f891654b56fad161d9b27c670176dabd9d"

$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
}

try {
    # Make a request to the Supabase REST API to list tables
    $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/?apikey=$supabaseKey" -Headers $headers -Method Get
    
    Write-Host "Tables in your Supabase project:"
    
    if ($response.PSObject.Properties.Count -eq 0) {
        Write-Host "No tables found"
    } else {
        foreach ($property in $response.PSObject.Properties.Name) {
            Write-Host "- $property"
        }
    }
} catch {
    Write-Host "Error fetching tables: $_"
}
