# frozen_string_literal: true
require 'rails_helper'

describe UserSerializer do
  subject(:serializer) { UserSerializer.new(user) }
  let(:user) { create(:user) }

  describe '#as_json' do
    subject(:json) { serializer.as_json }
    it { is_expected.to include :id, :email, :memberships }
  end
end
