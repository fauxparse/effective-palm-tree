@javascript
Feature: The app loads

  Scenario: Load the app
     When I visit the home page
     Then I should see the login form

  Scenario: Log in
     When I log in
     Then I should see my calendar
