# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Assignment, type: :model do
  subject(:assignment) { build(:assignment) }

  it { is_expected.to be_valid }
  it { is_expected.not_to be_confirmed }

  context 'when an identical assignment exists' do
    before { assignment.dup.save! }

    it { is_expected.not_to be_valid }
  end
end
