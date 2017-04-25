Given(/^I have received an invitation to join "([^"]*)"$/) do |group_name|
  select_group(group_name)
  InviteMember.new(member, admin_member, user.email).call
end

When(/^I send an invitation$/) do
  expect(page).to have_content(member.name)
  expect(page).to have_css('.invitation')
  within('form.invitation') do
    fill_in :email, with: member_email
    click_button 'Send'
  end
end

When(/^I click the link in the invitation email$/) do
  open_email(user.email)
  click_first_link_in_email
end

When(/^I accept the invitation$/) do
  within('form.invitation') do
    click_button 'Accept'
  end
end

Then(/^I should see progress as the invitation is sent$/) do
  within('form.invitation') do
    expect(page).to have_content('Sending…')
    expect(page).not_to have_content('Sending…')
  end
end

Then(/^Hicks should receive an invitation email$/) do
  expect(invitation_emails(member_email)).not_to be_empty
end

Then(
  /^I should see that "([^"]*)" has invited me to join "([^"]*)"$/
) do |admin, group|
  expect(page).to have_content("#{admin} has invited you to join #{group}")
end
