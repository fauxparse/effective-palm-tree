module GroupHelpers
  def group
    @group ||= create(:group)
  end

  def select_group(name)
    @group = Group.find_by(name: name) || create(:group, name: name)
  end
end

World(GroupHelpers)
