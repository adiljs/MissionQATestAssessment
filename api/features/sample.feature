Feature: API smoke test

  @debug
  Scenario: GET /posts/1 returns a post
    Given I set the API base URL to "https://jsonplaceholder.typicode.com"
    When I GET "/posts/1"
    Then the response status should be 200
    And the response body should contain a property "id" with value 1
