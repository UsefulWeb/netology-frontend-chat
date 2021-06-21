<?php

function send($data)
{
    echo json_encode($data);
}

function createMessage()
{
    $message = $_POST['message'] ?? null;
    $username = $_POST['username'] ?? null;

    if (empty($message) || empty($username)) {
        send([
            'ok' => false
        ]);
        return;
    }

    $id = addMessage([
        'message' => $message,
        'username' => $username,
    ]);

    send([
        'ok' => true,
        'id' => $id
    ]);
}

function listMessages()
{
    $messages = getMessages();

    send([
        'data' => $messages
    ]);
}

function getNewMessages()
{
    $lastUpdate = $_GET['last_update'];
    $messages = getMessages();
    $filtered = array_filter($messages, function ($message) use ($lastUpdate) {
        return $message['id'] > $lastUpdate;
    });
    $updates = array_values($filtered);

    send([
        'data' => $updates
    ]);
}
