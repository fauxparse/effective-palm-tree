# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Role, type: :model do
  subject(:role) { create(:role) }

  it { is_expected.to validate_presence_of(:name) }

  it 'has a unique name' do
    expect(role)
      .to validate_uniqueness_of(:name)
      .scoped_to(:group_id)
      .case_insensitive
  end

  describe '#plural' do
    subject(:plural) { role.plural }

    it { is_expected.to eq 'players' }
  end
end
