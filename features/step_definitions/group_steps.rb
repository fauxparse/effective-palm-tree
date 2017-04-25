Then(/^I should be on the "([^"]*)" group page$/) do |group_name|
  select_group(group_name)
  expect(page).to have_current_path group_path(group)
end
