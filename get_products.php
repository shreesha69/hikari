<?php
/**
 * GET Products API
 * Fetches all products from the database and returns them as JSON.
 */

// Enable CORS if needed (optional for same-domain requests)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database connection
require_once 'db_connect.php';

try {
    // 1. Prepare and execute the query
    $stmt = $conn->prepare("SELECT id, name, price, category, image, description FROM products");
    $stmt->execute();

    // 2. Fetch results
    $products = $stmt->fetchAll();

    // 3. Return as JSON
    echo JSON_encode($products);

} catch (PDOException $e) {
    // Return error message if query fails
    http_response_code(500);
    echo JSON_encode(["error" => "Database query failed: " . $e->getMessage()]);
}
?>
