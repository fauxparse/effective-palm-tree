@javascript
Feature: Invite members to become registered users

  Scenario: Invite an existing member
    Given I am logged in as an admin for "Sulaco"
      And "Hicks" is a member of "Sulaco"
     When I visit Hicks's member profile
      And I send an invitation
     Then I should see progress as the invitation is sent
      And Hicks should receive an invitation email

  Scenario: Accept an invitation as an existing user
    Given I am an existing user
      And I have received an invitation to join "Sulaco"
     When I click the link in the invitation email
      And I enter my login details
     Then I should see that "Burke" has invited me to join "Sulaco"
     When I accept the invitation
     Then I should be on the "Sulaco" group page
