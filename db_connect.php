<?php
/**
 * Hikari Database Connection Script
 * 
 * Instructions:
 * 1. Create a MySQL database and user in your hosting cPanel.
 * 2. Assign the user to the database with ALL PRIVILEGES.
 * 3. Fill in the credentials below.
 */

// Database configuration
$host = 'localhost'; 
$db_name = 'cambiopromotion_hikari_db';
$username = 'cambiopromotion_hikari-us';
$password = 'uSkMIZn#LQr#]$-C'; 


try {
    // Create PDO connection
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    
    // Set error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Set default fetch mode to associative array
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch(PDOException $e) {
    // Handle connection error
    die("Connection failed: " . $e->getMessage());
}
?>
