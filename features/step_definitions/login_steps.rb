Given(/^I am an existing user$/) do
  @user = create(:user)
end

When(/^I log in$/) do
  within(:css, '.login-dialog') do
    fill_in 'email', with: @user.email
    fill_in 'password', with: @user.password
    find(:css, '[type="submit"]').trigger('click')
  end
end

Then(/^I should see the login form$/) do
  expect(page).to have_css('.login-dialog')
end
