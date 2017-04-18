When(/^I send an invitation$/) do
  expect(page).to have_content(member.name)
  expect(page).to have_css('.invitation')
  within(:css, 'form.invitation') do
    fill_in :email, with: member_email
    click_button 'Send'
  end
end

Then(/^I should see progress as the invitation is sent$/) do
  within(:css, 'form.invitation') do
    expect(page).to have_content('Sending…')
    expect(page).not_to have_content('Sending…')
  end
end

Then(/^Hicks should receive an invitation email$/) do
  sleep 1 #flappy
  invitation_emails =
    unread_emails_for(member_email)
    .select { |m| m.subject =~ /invited/i }
  expect(invitation_emails).not_to be_empty
end
