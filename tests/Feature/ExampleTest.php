<?php

test('the application returns a health response', function () {
    $response = $this->get('/up');

    $response->assertStatus(200);
});
