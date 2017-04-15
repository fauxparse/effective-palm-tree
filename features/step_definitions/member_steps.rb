Given(/^"([^"]*)" is a member of "([^"]*)"$/) do |name, group|
  select_member(name, group)
end

Given(/^I am logged in as an admin for "([^"]*)"$/) do |group_name|
  select_group(group_name)
  login_as(admin_member.user)
  # page.driver.set_cookie(:remember_token, admin_member.user.remember_token)
  # visit root_path
end

When(/^I visit ([^']+)'s member profile$/) do |name|
  select_member(name)
  visit group_member_path(group, member)
end
