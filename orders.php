<?php
/**
 * ORDERS API
 * Handles placing new orders and fetching order history.
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");

require_once 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        if (!$data || !isset($data->action)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid request"]);
            exit();
        }

        if ($data->action === 'create') {
            // --- CREATE ORDER ---
            $conn->beginTransaction();

            $user_id = null;
            if (isset($data->customerEmail) && $data->customerEmail !== 'Guest') {
                $uStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
                $uStmt->execute([$data->customerEmail]);
                $user = $uStmt->fetch();
                if ($user) $user_id = $user['id'];
            }

            // Insert into orders table
            $stmt = $conn->prepare("INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)");
            $stmt->execute([$user_id, $data->total, 'Placed']);
            $order_id = $conn->lastInsertId();

            // Insert items
            $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            foreach ($data->items as $item) {
                // Find product ID from name/ref if needed, assuming id is passed in item
                // For this demo, we assume id is in item
                $prod_id = isset($item->id) ? $item->id : 'unknown';
                $itemStmt->execute([$order_id, $prod_id, $item->quantity, $item->price]);
            }

            $conn->commit();
            echo json_encode(["status" => "success", "order_id" => $order_id]);
        }
    } elseif ($method === 'GET') {
        // --- FETCH ORDERS ---
        if (isset($_GET['role']) && $_GET['role'] === 'admin') {
            // ADMIN VIEW: Fetch all orders with user details (if linked)
            $stmt = $conn->prepare("
                SELECT 
                    o.id, 
                    o.total_price AS total, 
                    o.status, 
                    o.created_at AS date,
                    COALESCE(u.name, 'Guest') AS customerName,
                    COALESCE(u.email, 'N/A') AS customerEmail
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
            ");
            $stmt->execute();
            $orders = $stmt->fetchAll();
            echo json_encode($orders);
        } else {
            // USER VIEW: Fetch orders for a specific email
            if (!isset($_GET['email'])) {
                http_response_code(400);
                echo json_encode(["error" => "Email required"]);
                exit();
            }

            $email = $_GET['email'];
            $stmt = $conn->prepare("
                SELECT o.id, o.total_price AS total, o.status, o.created_at AS date
                FROM orders o
                JOIN users u ON o.user_id = u.id
                WHERE u.email = ?
                ORDER BY o.created_at DESC
            ");
            $stmt->execute([$email]);
            $orders = $stmt->fetchAll();
            echo json_encode($orders);
        }
    }

} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Order processing failed: " . $e->getMessage()]);
}
?>
