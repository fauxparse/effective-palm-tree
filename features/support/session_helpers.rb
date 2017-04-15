module SessionHelpers
  def login_as(user)
    page.driver.set_cookie(:remember_token, user.remember_token)
    visit root_path
  end
end

World(SessionHelpers)
