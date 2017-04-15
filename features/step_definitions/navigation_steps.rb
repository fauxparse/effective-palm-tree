When(/^I visit the home page$/) do
  visit root_path
end

Then(/^I should see my calendar$/) do
  expect(page).to have_current_path(events_path)
  expect(page).to have_css('.calendar')
end
