<?php
/**
 * AUTH API (Login & Register)
 * Handles user authentication via POST requests.
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->action)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request. Action required."]);
    exit();
}

$action = $data->action;

try {
    if ($action === 'register') {
        // --- REGISTRATION LOGIC ---
        $name = $data->name;
        $email = $data->email;
        $phone = $data->phone;
        $address = $data->address;
        $password = $data->password; // Note: For production use password_hash()

        // Check if email exists
        $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$email]);
        if ($check->rowCount() > 0) {
            echo json_encode(["status" => "error", "message" => "Email already exists."]);
            exit();
        }

        // Insert user
        $stmt = $conn->prepare("INSERT INTO users (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone, $address, $password]);

        echo json_encode(["status" => "success", "user" => [
            "name" => $name,
            "email" => $email,
            "phone" => $phone,
            "address" => $address,
            "role" => "user"
        ]]);

    } elseif ($action === 'login') {
        // --- LOGIN LOGIC ---
        $email = $data->email;
        $password = $data->password;

        $stmt = $conn->prepare("SELECT name, email, phone, address, role FROM users WHERE email = ? AND password = ?");
        $stmt->execute([$email, $password]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode(["status" => "success", "user" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
        }
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
