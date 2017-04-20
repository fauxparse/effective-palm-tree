module MemberHelpers
  def user
    @user ||= create(:user)
  end

  def admin_member
    @admin_member ||=
      FactoryGirl.create(:administrator, group: group)
  end

  def member
    @member ||= create(:member, group: group)
  end

  def select_member(name, group_name = nil)
    select_group(group_name) if group_name.present?
    @member =
      group.members.find_by(name: name) ||
      create(:member, group: group, name: name)
  end

  def member_email
    member.user.try(:email) || "#{member.name.underscore}@sula.co"
  end
end

World(MemberHelpers)
