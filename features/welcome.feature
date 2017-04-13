@javascript
Feature: The app loads

  Scenario: Load the app
     When I visit the home page
     Then I should see the login form

  Scenario: Log in
    Given I am an existing user
     When I visit the home page
      And I log in
     Then I should see my calendar
