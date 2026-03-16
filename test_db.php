<?php
/**
 * Database Connection Test Script
 * Run this by visiting your-domain.com/test_db.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Hikari Database Connection Test</h2>";

require_once 'db_connect.php';

try {
    echo "<p style='color: green;'>✅ Success: Connected to the database successfully!</p>";
    
    // Test if products table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'products'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Success: 'products' table found.</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Warning: 'products' table NOT found. Did you import database_setup.sql?</p>";
    }
    
    // Test if users table exists and has the admin
    $stmt = $conn->query("SELECT COUNT(*) FROM users");
    $count = $stmt->fetchColumn();
    echo "<p style='color: green;'>✅ Success: 'users' table found with $count users.</p>";

} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>
