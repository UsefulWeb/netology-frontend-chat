<?php

function addMessage($data)
{
    $messages = getMessages();
    $id = count($messages) + 1;
    $item = [
        'id' => $id,
        'username' => $data['username'],
        'message' => $data['message'],
        'date' => time(),
    ];
    array_push($messages, $item);

    $data = json_encode($messages);
    $path = __DIR__ . '/data.json';
    file_put_contents($path, $data);

    return $id;
}

function getMessages()
{
    $path = __DIR__ . '/data.json';
    $json = file_get_contents($path);
    $data = json_decode($json, true);
    if (empty($data)) {
        return [];
    }
    return $data;
}
