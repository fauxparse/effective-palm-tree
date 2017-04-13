When(/^I visit the home page$/) do
  visit root_path
end

Then(/^I should see my calendar$/) do
  expect(page.current_path).to eq events_path
  expect(page).to have_css('.calendar')
end
