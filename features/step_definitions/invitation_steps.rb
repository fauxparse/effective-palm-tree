When(/^I send an invitation$/) do
  expect(page).to have_content(member.name)
  expect(page).to have_css('.invitation')
  within(:css, 'section.invitation') do
    fill_in :email, with: member_email
    click_button 'Send'
  end
end

Then(/^I should see progress as the invitation is sent$/) do
  within(:css, 'section.invitation') do
    expect(page).to have_content('Sending…')
    # expect(page).to have_content('Sent')
  end
end

Then(/^Hicks should receive an invitation email$/) do
  pending # Write code here that turns the phrase above into concrete actions
end
