<?php

require 'protected/actions.php';
require 'protected/messages.php';

$action = $_REQUEST['action'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];
$isPost = $method === 'POST';

$hasAction = !empty($action);
$isCreateMessage = $hasAction && $isPost && $action === 'create-message';
$isListMessages = $hasAction && $action === 'list-messages';
$isNewMessages = $hasAction && $action === 'new-messages';

if ($isCreateMessage) {
    createMessage();
    return;
}

if ($isListMessages) {
    listMessages();
    return;
}

if ($isNewMessages) {
    getNewMessages();
    return;
}

require __DIR__ . '/protected/view.php';
