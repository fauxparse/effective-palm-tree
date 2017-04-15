@javascript
Feature: Invite members to become registered users

  Scenario: Invite an existing member
    Given I am logged in as an admin for "Sulaco"
      And "Hicks" is a member of "Sulaco"
     When I visit Hicks's member profile
      And I send an invitation
     Then I should see progress as the invitation is sent
      And Hicks should receive an invitation email
