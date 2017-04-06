# frozen_string_literal: true

require 'rails_helper'

describe GroupSerializer, type: :serializer do
  subject(:serializer) do
    GroupSerializer.new(group, include: %i[members roles])
  end

  let(:group) { create(:group, :with_roles, :with_members) }

  describe 'as JSON' do
    subject(:json) { serializer.as_json }

    it { is_expected.to include :name, :slug, :members, :roles }

    describe(':members') do
      subject(:members) { json[:members] }

      it { is_expected.to have_exactly(5).items }
    end

    describe(':roles') do
      subject(:roles) { json[:roles] }

      it { is_expected.to have_exactly(3).items }
    end
  end
end
