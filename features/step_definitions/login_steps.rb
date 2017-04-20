When(/^I log in$/) do
  visit root_path
  step 'I enter my login details'
end

When(/^I enter my login details$/) do
  within(:css, '.login-dialog') do
    fill_in 'email', with: user.email
    fill_in 'password', with: attributes_for(:user)[:password]
    find(:css, '[type="submit"]').trigger('click')
  end
end

Then(/^I should see the login form$/) do
  expect(page).to have_css('.login-dialog')
end
