<?php
/**
 * USERS API (Admin Only)
 * Fetches all users from the database.
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

// Future: Add real session/token check here for role=admin
if (!isset($_GET['role']) || $_GET['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Access denied. Admin only."]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC");
    $stmt->execute();
    $users = $stmt->fetchAll();
    
    echo json_encode($users);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
